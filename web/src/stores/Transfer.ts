import { makeAutoObservable, runInAction } from 'mobx';
import { v4 } from 'uuid';
import type { NetworkStore } from './NetworkStore';
import { TransferState } from '../types/TransferState';
import type { ApplicationStore } from './ApplicationStore';
import {
  ActionMessageActionType,
  ActionMessageModel,
  MessageType,
  RTCCandidateMessageModel,
  RTCDescriptionMessageModel,
} from '@filedrop/types';

export class Transfer {
  blobUrl?: string = undefined;
  peerConnection?: RTCPeerConnection = undefined;
  offset?: number = undefined;
  speed?: number = undefined;
  time?: number = undefined;
  timeLeft?: number = undefined;
  state: TransferState;
  applicationStore: ApplicationStore;

  constructor(
    private network: NetworkStore,
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
    this.applicationStore = this.network.applicationStore;

    makeAutoObservable(this);
  }

  cancel() {
    if (this.peerConnection) {
      try {
        this.peerConnection.close();
      } catch {}
    }

    const message: ActionMessageModel = {
      type: MessageType.ACTION,
      transferId: this.transferId,
      targetId: this.targetId,
      action: ActionMessageActionType.CANCEL,
    };

    this.applicationStore.send(message);
    this.network.removeTransfer(this.transferId);
  }

  accept() {
    const message: ActionMessageModel = {
      type: MessageType.ACTION,
      transferId: this.transferId,
      targetId: this.targetId,
      action: ActionMessageActionType.ACCEPT,
    };

    this.applicationStore.send(message);
    this.state = TransferState.CONNECTING;
  }

  setRemoteDescription(description: RTCSessionDescription) {
    const peerConnection = this.peerConnection;
    if (
      peerConnection &&
      peerConnection.connectionState !== 'disconnected' &&
      peerConnection.connectionState !== 'failed'
    ) {
      peerConnection.setRemoteDescription(description).catch(() => {});
    }
  }

  addIceCandiate(candidate: RTCIceCandidate) {
    const peerConnection = this.peerConnection;
    if (
      peerConnection &&
      peerConnection.connectionState !== 'disconnected' &&
      peerConnection.connectionState !== 'failed'
    ) {
      peerConnection.addIceCandidate(candidate).catch(() => {});
    }
  }

  async start(remoteDescription?: any) {
    const connection = new RTCPeerConnection(
      this.applicationStore.rtcConfiguration
    );
    this.peerConnection = connection;

    if (this.receiving) {
      await connection.setRemoteDescription(remoteDescription);
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);

      const message: RTCDescriptionMessageModel = {
        type: MessageType.RTC_DESCRIPTION,
        transferId: this.transferId,
        targetId: this.targetId,
        data: {
          type: connection.localDescription!.type,
          sdp: connection.localDescription!.sdp,
        },
      };
      this.applicationStore.send(message);

      connection.addEventListener('icecandidate', e => {
        if (!e || !e.candidate) return;

        const message: RTCCandidateMessageModel = {
          type: MessageType.RTC_CANDIDATE,
          targetId: this.targetId,
          transferId: this.transferId,
          data: e.candidate,
        };

        this.applicationStore.send(message);
      });

      const start = new Date().getTime();
      const buffer: BlobPart[] = [];
      let offset = 0;

      let complete = false;
      const onFailure = () => {
        complete = true;

        runInAction(() => {
          this.state = TransferState.FAILED;
          this.offset = undefined;
          this.speed = 0;
          this.timeLeft = 0;
        });
      };

      const onComplete = () => {
        complete = true;

        const blob = new Blob(buffer);
        const blobUrl = URL.createObjectURL(blob);

        const now = new Date().getTime();
        const elapsed = (now - start) / 1000;

        runInAction(() => {
          this.state = TransferState.COMPLETE;
          this.offset = undefined;
          this.speed = 0;
          this.time = Math.floor(elapsed);
          this.timeLeft = 0;
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
        });

        const channel = event.channel;
        channel.binaryType = 'arraybuffer';

        let lastUpdate = 0;
        channel.addEventListener('message', event => {
          buffer.push(event.data);
          offset += event.data.byteLength;

          const now = new Date().getTime();
          const elapsed = (now - start) / 1000;

          if (now - lastUpdate > 50) {
            lastUpdate = now;
            const speed = offset / elapsed;

            runInAction(() => {
              this.state = TransferState.IN_PROGRESS;
              this.offset = offset;
              this.speed = speed;
              this.time = Math.floor(elapsed);
              this.timeLeft = Math.round((this.fileSize - offset) / speed);
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

      connection.addEventListener('iceconnectionstatechange', () => {
        if (
          (connection.iceConnectionState === 'failed' ||
            connection.iceConnectionState === 'disconnected') &&
          !complete
        ) {
          onFailure();
        }
      });
    } else {
      const connection = new RTCPeerConnection(
        this.applicationStore.rtcConfiguration
      );
      this.peerConnection = connection;

      const file = this.file!;

      connection.addEventListener('negotiationneeded', async () => {
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);

        const message: RTCDescriptionMessageModel = {
          type: MessageType.RTC_DESCRIPTION,
          transferId: this.transferId,
          targetId: this.targetId,
          data: {
            type: connection.localDescription!.type,
            sdp: connection.localDescription!.sdp,
          },
        };

        this.applicationStore.send(message);
      });

      connection.addEventListener('icecandidate', e => {
        if (!e || !e.candidate) return;

        const message: RTCCandidateMessageModel = {
          type: MessageType.RTC_CANDIDATE,
          transferId: this.transferId,
          targetId: this.targetId,
          data: e.candidate,
        };

        this.applicationStore.send(message);
      });

      const channel = connection.createDataChannel('sendDataChannel');
      channel.binaryType = 'arraybuffer';

      const start = new Date().getTime();

      let complete = false;
      const onFailure = () => {
        complete = true;

        runInAction(() => {
          this.state = TransferState.FAILED;
          this.offset = undefined;
          this.speed = 0;
          this.timeLeft = 0;
        });
      };

      channel.addEventListener('open', () => {
        const bufferSize = connection.sctp?.maxMessageSize || 65535;
        runInAction(() => {
          this.state = TransferState.CONNECTED;
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
          const elapsed = (now - start) / 1000;

          if (now - lastUpdate > 50) {
            lastUpdate = now;
            const speed = offset / elapsed;
            runInAction(() => {
              this.state = TransferState.IN_PROGRESS;
              this.offset = offset;
              this.speed = speed;
              this.time = Math.floor(elapsed);
              this.timeLeft = Math.round((file.size - offset) / speed);
            });
          }

          if (offset >= file.size) {
            runInAction(() => {
              this.state = TransferState.COMPLETE;
              this.offset = undefined;
              this.speed = 0;
              this.time = Math.floor(elapsed);
              this.timeLeft = 0;
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

      connection.addEventListener('iceconnectionstatechange', () => {
        if (
          (connection.iceConnectionState === 'failed' ||
            connection.iceConnectionState === 'disconnected') &&
          !complete
        ) {
          onFailure();
        }
      });
    }
  }
}
