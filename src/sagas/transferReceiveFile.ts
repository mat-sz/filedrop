import { put, select, call } from 'redux-saga/effects';

import {
  TransferModel,
  RTCDescriptionMessageModel,
  RTCCandidateMessageModel,
} from '../types/Models';
import { StateType } from '../reducers';
import { TransferState } from '../types/TransferState';
import { updateTransferAction } from '../actions/transfers';
import { sendMessageAction } from '../actions/websocket';
import { MessageType } from '../types/MessageType';

export default function* transferReceiveFile(
  rtcMessage: RTCDescriptionMessageModel,
  dispatch: (action: any) => void
) {
  const transfers: TransferModel[] = yield select(
    (state: StateType) => state.transfers
  );
  const filteredTransfers: TransferModel[] = transfers.filter(
    transfer => transfer.transferId === rtcMessage.transferId
  );
  if (filteredTransfers.length === 0) return;

  const transfer = filteredTransfers[0];
  if (!transfer) return;

  const rtcConfiguration = yield select(
    (state: StateType) => state.rtcConfiguration
  );
  const connection = new RTCPeerConnection(rtcConfiguration);

  yield put(
    updateTransferAction({
      transferId: transfer.transferId,
      peerConnection: connection,
    })
  );

  connection.addEventListener('icecandidate', e => {
    if (!e || !e.candidate) return;

    const candidateMessage: RTCCandidateMessageModel = {
      type: MessageType.RTC_CANDIDATE,
      targetId: transfer.clientId,
      transferId: transfer.transferId,
      data: e.candidate,
    };

    dispatch(sendMessageAction(candidateMessage));
  });

  const timestamp = new Date().getTime() / 1000;
  const buffer: BlobPart[] = [];
  let offset = 0;

  let complete = false;
  const onFailure = () => {
    complete = true;

    dispatch(
      updateTransferAction({
        transferId: transfer.transferId,
        state: TransferState.FAILED,
        progress: 1,
        speed: 0,
      })
    );
  };

  const onComplete = () => {
    complete = true;

    const blob = new Blob(buffer);
    const blobUrl = URL.createObjectURL(blob);

    dispatch(
      updateTransferAction({
        transferId: transfer.transferId,
        state: TransferState.COMPLETE,
        progress: 1,
        speed: 0,
        time: Math.floor(new Date().getTime() / 1000 - timestamp),
        blobUrl: blobUrl,
      })
    );

    const element = document.createElement('a');
    element.setAttribute('href', blobUrl);
    element.setAttribute('download', transfer.fileName);

    element.style.display = 'none';
    element.click();

    connection.close();
  };

  connection.addEventListener('datachannel', event => {
    dispatch(
      updateTransferAction({
        transferId: transfer.transferId,
        state: TransferState.CONNECTED,
      })
    );

    const channel = event.channel;

    channel.binaryType = 'arraybuffer';
    channel.addEventListener('message', event => {
      buffer.push(event.data);
      offset += event.data.byteLength;

      dispatch(
        updateTransferAction({
          transferId: transfer.transferId,
          state: TransferState.IN_PROGRESS,
          progress: offset / transfer.fileSize,
          speed: offset / (new Date().getTime() / 1000 - timestamp),
        })
      );

      if (offset >= transfer.fileSize) {
        onComplete();
        channel.close();
      }
    });

    channel.addEventListener('close', () => {
      if (offset < transfer.fileSize) {
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

  yield call(
    async () => await connection.setRemoteDescription(rtcMessage.data)
  );

  const answer = yield call(async () => await connection.createAnswer());
  yield call(async () => await connection.setLocalDescription(answer));

  const nextRtcMessage: RTCDescriptionMessageModel = {
    type: MessageType.RTC_DESCRIPTION,
    transferId: transfer.transferId,
    targetId: transfer.clientId,
    data: {
      type: connection.localDescription.type,
      sdp: connection.localDescription.sdp,
    },
  };

  yield put(sendMessageAction(nextRtcMessage));
}
