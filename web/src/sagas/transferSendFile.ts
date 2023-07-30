import { put, select } from 'redux-saga/effects';

import {
  TransferModel,
  ActionMessageModel,
  RTCDescriptionMessageModel,
  RTCCandidateMessageModel,
} from '../types/Models';
import { StateType } from '../reducers';
import { TransferState } from '../types/TransferState';
import { updateTransferAction } from '../actions/transfers';
import { sendMessageAction } from '../actions/websocket';
import { MessageType } from '../types/MessageType';

export default function* transferSendFile(
  actionMessage: ActionMessageModel,
  dispatch: (action: any) => void
) {
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

  const file = transfer.file;

  const rtcConfiguration: RTCConfiguration = yield select(
    (state: StateType) => state.rtcConfiguration
  );
  const connection = new RTCPeerConnection(rtcConfiguration);

  yield put(
    updateTransferAction({
      transferId: transfer.transferId,
      peerConnection: connection,
    })
  );

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

    dispatch(sendMessageAction(nextRtcMessage));
  });

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

  const channel = connection.createDataChannel('sendDataChannel');
  channel.binaryType = 'arraybuffer';

  const timestamp = new Date().getTime() / 1000;

  let complete = false;
  const onFailure = () => {
    complete = true;

    dispatch(
      updateTransferAction({
        transferId: transfer.transferId,
        state: TransferState.FAILED,
        progress: 1,
        speed: 0,
        timeLeft: 0,
      })
    );
  };

  const bufferSize = (connection as any).sctp?.maxMessageSize || 65535;

  channel.addEventListener('open', () => {
    dispatch(
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
      dispatch(
        updateTransferAction({
          transferId: transfer.transferId,
          state: TransferState.IN_PROGRESS,
          progress: offset / file.size,
          speed,
          timeLeft: Math.round((file.size - offset) / speed),
        })
      );

      if (offset >= file.size) {
        dispatch(
          updateTransferAction({
            transferId: transfer.transferId,
            state: TransferState.COMPLETE,
            progress: 1,
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
