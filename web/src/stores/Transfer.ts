import { makeAutoObservable, runInAction } from 'mobx';
import { v4 } from 'uuid';
import {
  ActionMessageActionType,
  ActionMessageModel,
  MessageType,
  RTCCandidateMessageModel,
  RTCDescriptionMessageModel,
} from '@filedrop/types';

import { TransferState } from '../types/TransferState';
import type { NetworkStore } from './NetworkStore';
import type { Connection } from './Connection';

export class Transfer {
  blobUrl?: string = undefined;
  peerConnection?: RTCPeerConnection = undefined;
  offset?: number = undefined;
  startedAt?: number = undefined;
  state: TransferState;

  constructor(
    private network: NetworkStore,
    private connection: Connection,
    public file: File | undefined,
    public targetId: string,
    public fileName: string,
    public fileSize: number,
    public fileType: string,
    public preview?: string,
    public transferId: string = v4(),
    public receiving = false
  ) {
    this.state = receiving ? TransferState.INCOMING : TransferState.OUTGOING;

    makeAutoObservable(this);
  }

  get canAccept() {
    return this.state !== TransferState.INCOMING;
  }

  get isActive() {
    return (
      this.state === TransferState.CONNECTED ||
      this.state === TransferState.CONNECTING ||
      this.state === TransferState.IN_PROGRESS
    );
  }

  get isDone() {
    return (
      this.state === TransferState.COMPLETE ||
      this.state === TransferState.FAILED
    );
  }

  private sendAction(action: ActionMessageActionType) {
    const message: ActionMessageModel = {
      type: MessageType.ACTION,
      transferId: this.transferId,
      targetId: this.targetId,
      action,
    };

    this.connection.send(message);
  }

  cancel() {
    this.stop();
    this.sendAction(ActionMessageActionType.CANCEL);
    this.network.removeTransfer(this.transferId);
  }

  accept() {
    if (!this.canAccept) {
      return;
    }

    this.sendAction(ActionMessageActionType.ACCEPT);
    this.state = TransferState.CONNECTING;
  }

  validPeerConnection() {
    const peerConnection = this.peerConnection;
    return peerConnection &&
      peerConnection.connectionState !== 'disconnected' &&
      peerConnection.connectionState !== 'failed'
      ? peerConnection
      : undefined;
  }

  setRemoteDescription(description: RTCSessionDescription) {
    this.validPeerConnection()
      ?.setRemoteDescription(description)
      .catch(() => {});
  }

  addIceCandiate(candidate: RTCIceCandidate) {
    this.validPeerConnection()
      ?.addIceCandidate(candidate)
      .catch(() => {});
  }

  timeElapsed() {
    if (!this.startedAt) {
      return undefined;
    }

    const now = new Date().getTime();
    return (now - this.startedAt) / 1000;
  }

  timeLeft() {
    const offset = this.offset;
    const speed = this.speed();

    if (!offset || !speed) {
      return undefined;
    }

    return Math.round((this.fileSize - offset) / speed);
  }

  speed() {
    const elapsed = this.timeElapsed();
    const offset = this.offset;

    if (!elapsed || !offset) {
      return undefined;
    }

    return offset / elapsed;
  }

  uploadSpeed() {
    if (this.receiving) {
      return 0;
    }

    return this.speed() || 0;
  }

  downloadSpeed() {
    if (!this.receiving) {
      return 0;
    }

    return this.speed() || 0;
  }

  private sendDescription(description: RTCSessionDescription) {
    const message: RTCDescriptionMessageModel = {
      type: MessageType.RTC_DESCRIPTION,
      transferId: this.transferId,
      targetId: this.targetId,
      data: {
        type: description.type,
        sdp: description.sdp,
      },
    };

    this.connection.send(message);
  }

  async start(remoteDescription?: any) {
    if (remoteDescription?.data?.type === 'answer') {
      this.setRemoteDescription(remoteDescription);
      return;
    }

    const connection = new RTCPeerConnection(this.network.rtcConfiguration);
    this.peerConnection = connection;

    connection.addEventListener('icecandidate', e => {
      if (!e || !e.candidate) return;

      const message: RTCCandidateMessageModel = {
        type: MessageType.RTC_CANDIDATE,
        transferId: this.transferId,
        targetId: this.targetId,
        data: e.candidate,
      };

      this.connection.send(message);
    });

    let complete = false;
    const onFailure = () => {
      complete = true;

      runInAction(() => {
        this.state = TransferState.FAILED;
        this.offset = undefined;
      });
    };

    connection.addEventListener('iceconnectionstatechange', () => {
      if (
        (connection.iceConnectionState === 'failed' ||
          connection.iceConnectionState === 'disconnected') &&
        !complete
      ) {
        onFailure();
      }
    });

    if (this.receiving) {
      await connection.setRemoteDescription(remoteDescription);
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);
      this.sendDescription(connection.localDescription!);

      const buffer: BlobPart[] = [];
      let offset = 0;

      const onComplete = () => {
        complete = true;

        const blob = new Blob(buffer);
        const blobUrl = URL.createObjectURL(blob);

        runInAction(() => {
          this.state = TransferState.COMPLETE;
          this.blobUrl = blobUrl;
        });

        const element = document.createElement('a');
        element.setAttribute('href', blobUrl);
        element.setAttribute('download', this.fileName);

        element.style.display = 'none';
        element.click();

        connection.close();
      };

      connection.addEventListener('datachannel', event => {
        runInAction(() => {
          this.state = TransferState.CONNECTED;
          this.startedAt = new Date().getTime();
        });

        const channel = event.channel;
        channel.binaryType = 'arraybuffer';

        let lastUpdate = 0;
        channel.addEventListener('message', event => {
          buffer.push(event.data);
          offset += event.data.byteLength;

          const now = new Date().getTime();

          if (now - lastUpdate > 50) {
            lastUpdate = now;

            runInAction(() => {
              this.state = TransferState.IN_PROGRESS;
              this.offset = offset;
            });
          }

          if (offset >= this.fileSize) {
            onComplete();
            channel.close();
          }
        });

        channel.addEventListener('close', () => {
          if (offset < this.fileSize) {
            onFailure();
          } else if (!complete) {
            onComplete();
          }
        });
      });
    } else {
      const file = this.file!;

      connection.addEventListener('negotiationneeded', async () => {
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
        this.sendDescription(connection.localDescription!);
      });

      const channel = connection.createDataChannel('sendDataChannel');
      channel.binaryType = 'arraybuffer';

      channel.addEventListener('open', () => {
        const bufferSize = connection.sctp?.maxMessageSize || 65535;
        runInAction(() => {
          this.state = TransferState.CONNECTED;
          this.startedAt = new Date().getTime();
        });

        const fileReader = new FileReader();
        let offset = 0;

        const nextSlice = (currentOffset: number) => {
          const slice = file.slice(currentOffset, currentOffset + bufferSize);
          fileReader.readAsArrayBuffer(slice);
        };

        let lastUpdate = 0;
        fileReader.addEventListener('load', e => {
          if (complete) return;
          const buffer = e.target!.result as ArrayBuffer;

          try {
            channel.send(buffer);
          } catch {
            onFailure();
            channel.close();
            return;
          }

          offset += buffer.byteLength;

          const now = new Date().getTime();

          if (now - lastUpdate > 50) {
            lastUpdate = now;
            runInAction(() => {
              this.state = TransferState.IN_PROGRESS;
              this.offset = offset;
            });
          }

          if (offset >= file.size) {
            runInAction(() => {
              this.state = TransferState.COMPLETE;
            });

            complete = true;
            // Uncomment the next line if there are issues with transfers getting stuck at 100%.
            // channel.close();
          } else if (channel.bufferedAmount < bufferSize / 2) {
            nextSlice(offset);
          }
        });

        channel.bufferedAmountLowThreshold = bufferSize / 2;
        channel.addEventListener('bufferedamountlow', () => nextSlice(offset));

        nextSlice(0);
      });

      channel.addEventListener('close', () => {
        if (!complete) {
          onFailure();
        }

        connection.close();
      });
    }
  }

  stop() {
    if (this.peerConnection) {
      try {
        this.peerConnection.close();
      } catch {}
    }
  }
}
