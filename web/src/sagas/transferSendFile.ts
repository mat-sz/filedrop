import { call, put, select, take } from 'redux-saga/effects';
import { eventChannel, END, EventChannel, buffers } from 'redux-saga';
import {
  ActionMessageModel,
  RTCDescriptionMessageModel,
  RTCCandidateMessageModel,
  MessageType,
} from '@filedrop/types';

import { ActionModel, TransferModel } from '../types/Models';
import { StateType } from '../reducers';
import { TransferState } from '../types/TransferState';
import { updateTransferAction } from '../actions/transfers';
import { sendMessageAction } from '../actions/websocket';

function handleConnection(
  transfer: TransferModel,
  connection: RTCPeerConnection
) {
  return eventChannel<ActionModel>(emitter => {
    const file = transfer.file!;

    connection.addEventListener('negotiationneeded', async () => {
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);

      const nextRtcMessage: RTCDescriptionMessageModel = {
        type: MessageType.RTC_DESCRIPTION,
        transferId: transfer.transferId,
        targetId: transfer.clientId,
        data: {
          type: connection.localDescription!.type,
          sdp: connection.localDescription!.sdp,
        },
      };

      emitter(sendMessageAction(nextRtcMessage));
    });

    connection.addEventListener('icecandidate', e => {
      if (!e || !e.candidate) return;

      const candidateMessage: RTCCandidateMessageModel = {
        type: MessageType.RTC_CANDIDATE,
        targetId: transfer.clientId,
        transferId: transfer.transferId,
        data: e.candidate,
      };

      emitter(sendMessageAction(candidateMessage));
    });

    const channel = connection.createDataChannel('sendDataChannel');
    channel.binaryType = 'arraybuffer';

    const timestamp = new Date().getTime() / 1000;

    let complete = false;
    const onFailure = () => {
      complete = true;

      emitter(
        updateTransferAction({
          transferId: transfer.transferId,
          state: TransferState.FAILED,
          offset: undefined,
          speed: 0,
          timeLeft: 0,
        })
      );
    };

    const bufferSize = (connection as any).sctp?.maxMessageSize || 65535;

    channel.addEventListener('open', () => {
      emitter(
        updateTransferAction({
          transferId: transfer.transferId,
          state: TransferState.CONNECTED,
        })
      );

      const fileReader = new FileReader();
      let offset = 0;

      const nextSlice = (currentOffset: number) => {
        const slice = file.slice(offset, currentOffset + bufferSize);
        fileReader.readAsArrayBuffer(slice);
      };

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

        const speed = offset / (new Date().getTime() / 1000 - timestamp);
        emitter(
          updateTransferAction({
            transferId: transfer.transferId,
            state: TransferState.IN_PROGRESS,
            offset,
            speed,
            timeLeft: Math.round((file.size - offset) / speed),
          })
        );

        if (offset >= file.size) {
          emitter(
            updateTransferAction({
              transferId: transfer.transferId,
              state: TransferState.COMPLETE,
              offset: undefined,
              speed: 0,
              time: Math.floor(new Date().getTime() / 1000 - timestamp),
              timeLeft: 0,
            })
          );

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
      emitter(END);
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

    // The subscriber must return an unsubscribe function
    return () => {
      connection.close();
    };
  }, buffers.expanding());
}

export function* transferSendFile(actionMessage: ActionMessageModel) {
  yield put(
    updateTransferAction({
      transferId: actionMessage.transferId,
      state: TransferState.CONNECTING,
    })
  );

  const transfers: TransferModel[] = yield select(
    (state: StateType) => state.transfers
  );
  const filteredTransfers: TransferModel[] = transfers.filter(
    transfer => transfer.transferId === actionMessage.transferId
  );
  if (filteredTransfers.length === 0) return;

  const transfer = filteredTransfers[0];
  if (!transfer || !transfer.file) return;

  const rtcConfiguration: RTCConfiguration = yield select(
    (state: StateType) => state.rtcConfiguration
  );
  const connection = new RTCPeerConnection(rtcConfiguration);

  const channel: EventChannel<ActionModel> = yield call(
    handleConnection,
    transfer,
    connection
  );

  yield put(
    updateTransferAction({
      transferId: transfer.transferId,
      peerConnection: connection,
    })
  );

  try {
    while (true) {
      const action: ActionModel = yield take(channel);
      yield put(action);
    }
  } finally {
  }
}
