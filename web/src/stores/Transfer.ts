import { makeAutoObservable, runInAction } from 'mobx';
import { nanoid } from 'nanoid';
import {
  ActionMessageActionType,
  ActionMessageModel,
  MessageType,
  RTCCandidateMessageModel,
  RTCDescriptionMessageModel,
} from '@filedrop/types';
import { download, toString } from 'fitool';

import { TransferState } from '../types/TransferState.js';
import type { NetworkStore } from './NetworkStore.js';
import type { Connection } from './Connection.js';
import { isClipboardItemSupported } from '../utils/browser.js';
import { copy } from '../utils/copy.js';
import { fromImage } from 'imtool';
import { settingsStore } from './SettingsStore.js';

export class Transfer {
  blob?: Blob = undefined;
  blobUrl?: string = undefined;
  peerConnection?: RTCPeerConnection = undefined;
  offset?: number = undefined;
  startedAt?: number = undefined;
  state: TransferState;
  text?: string = undefined;
  sortTimestamp: number = new Date().getTime();

  constructor(
    private network: NetworkStore,
    private connection: Connection,
    public file: File | undefined,
    public targetId: string,
    public fileName: string,
    public fileSize: number,
    public fileType: string,
    public preview?: string,
    public transferId: string = nanoid(),
    public receiving = false
  ) {
    this.state = receiving ? TransferState.INCOMING : TransferState.OUTGOING;

    makeAutoObservable(this);
  }

  get canAccept() {
    return this.state === TransferState.INCOMING;
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

  get canDownload() {
    return this.state === TransferState.COMPLETE && !!this.blobUrl;
  }

  get canCopy() {
    return (
      this.state === TransferState.COMPLETE &&
      (!!this.text ||
        (this.blob &&
          this.fileType.startsWith('image/') &&
          isClipboardItemSupported))
    );
  }

  async copy() {
    if (this.text) {
      await copy(this.text!);
    } else if (this.blob && this.fileType.startsWith('image/')) {
      if (this.fileType === 'image/png') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': this.blob }),
        ]);
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': fromImage(this.blob).then(canvas =>
              canvas.type('image/png').toBlob()
            ),
          }),
        ]);
      }
    }
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
    this.moveToTop();
  }

  validPeerConnection() {
    const peerConnection = this.peerConnection;
    return peerConnection &&
      peerConnection.connectionState !== 'disconnected' &&
      peerConnection.connectionState !== 'failed'
      ? peerConnection
      : undefined;
  }

  addIceCandidate(candidate: RTCIceCandidate) {
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

  private stateFailed() {
    this.state = TransferState.FAILED;
    this.offset = undefined;
    this.moveToTop();
  }

  private stateComplete(blob?: Blob) {
    this.state = TransferState.COMPLETE;
    this.moveToTop();

    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      this.blob = blob;
      this.blobUrl = blobUrl;
      this.textFromBlob(blob);
      if (settingsStore.settings.autoDownload) {
        download(blobUrl, this.fileName);
      }
    }
  }

  private stateConnected() {
    this.state = TransferState.CONNECTED;
    this.startedAt = new Date().getTime();
    this.moveToTop();
  }

  private stateInProgress(offset: number) {
    this.state = TransferState.IN_PROGRESS;
    this.offset = offset;
  }

  private moveToTop() {
    this.sortTimestamp = new Date().getTime();
  }

  private async textFromBlob(blob: Blob) {
    if (
      (this.fileType.startsWith('text/') || !this.fileType) &&
      this.fileSize <= 10 * 1024 * 1024
    ) {
      const text = await toString(blob);
      runInAction(() => {
        this.text = text;
      });
    }
  }

  async start(remoteDescription?: any) {
    if (remoteDescription?.type === 'answer') {
      this.validPeerConnection()
        ?.setRemoteDescription(remoteDescription)
        .catch(() => {});
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

    connection.addEventListener('iceconnectionstatechange', () => {
      if (
        (connection.iceConnectionState === 'failed' ||
          connection.iceConnectionState === 'disconnected') &&
        !this.isDone
      ) {
        this.stateFailed();
      }
    });

    let lastUpdate = 0;
    const progressUpdate = (offset: number) => {
      const now = new Date().getTime();

      if (now - lastUpdate > 50) {
        lastUpdate = now;
        this.stateInProgress(offset);
      }
    };

    if (this.receiving) {
      await connection.setRemoteDescription(remoteDescription);
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);
      this.sendDescription(connection.localDescription!);

      const buffer: BlobPart[] = [];
      let offset = 0;

      connection.addEventListener('datachannel', event => {
        this.stateConnected();

        const channel = event.channel;
        channel.binaryType = 'arraybuffer';

        channel.addEventListener('message', event => {
          buffer.push(event.data);
          offset += event.data.byteLength;
          progressUpdate(offset);

          if (offset >= this.fileSize) {
            this.stateComplete(new Blob(buffer, { type: this.fileType }));
            channel.close();
            connection.close();
          }
        });

        channel.addEventListener('close', () => {
          if (offset < this.fileSize) {
            this.stateFailed();
          } else if (!this.isDone) {
            this.stateComplete(new Blob(buffer, { type: this.fileType }));
            connection.close();
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
        this.stateConnected();

        const fileReader = new FileReader();
        let offset = 0;

        const nextSlice = (currentOffset: number) => {
          const slice = file.slice(currentOffset, currentOffset + bufferSize);
          fileReader.readAsArrayBuffer(slice);
        };

        fileReader.addEventListener('load', e => {
          if (this.isDone) return;
          const buffer = e.target!.result as ArrayBuffer;

          try {
            channel.send(buffer);
          } catch {
            this.stateFailed();
            channel.close();
            return;
          }

          offset += buffer.byteLength;
          progressUpdate(offset);

          if (offset >= file.size) {
            this.stateComplete();
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
        if (!this.isDone) {
          this.stateFailed();
        }

        connection.close();
      });
    }
  }

  stop() {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }

    if (this.peerConnection) {
      try {
        this.peerConnection.close();
      } catch {}
    }
  }
}
