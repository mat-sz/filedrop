import { put, select, call } from 'redux-saga/effects';

import { TransferModel, RTCDescriptionMessageModel, RTCCandidateMessageModel } from '../types/Models';
import { ActionType } from '../types/ActionType';
import { StateType } from '../reducers';
import { rtcConfiguration } from '../config';

export default function* transferReceiveFile(rtcMessage: RTCDescriptionMessageModel, dispatch: (action: any) => void) {
    const activeTransfers: TransferModel[] = yield select((state: StateType) => state.activeTransfers);
    const filteredTransfers: TransferModel[] = activeTransfers.filter((transfer) => transfer.transferId === rtcMessage.transferId);
    if (filteredTransfers.length === 0) return;

    const transfer = filteredTransfers[0];
    if (!transfer) return;

    const connection = new RTCPeerConnection(rtcConfiguration);

    yield put({ type: ActionType.ADD_PEER_CONNECTION, value: {
        transferId: transfer.transferId,
        peerConnection: connection,
    } });

    connection.addEventListener('icecandidate', (e) => {
        if (!e || !e.candidate) return;

        const candidateMessage: RTCCandidateMessageModel = {
            type: 'rtcCandidate',
            targetId: transfer.clientId,
            transferId: transfer.transferId,
            data: e.candidate,
        };

        dispatch({ type: ActionType.WS_SEND_MESSAGE, value: candidateMessage });
    });

    const timestamp = new Date().getTime() / 1000;
    const buffer: BlobPart[] = [];
    let offset = 0;

    let complete = false;
    const onFailure = () => {
        complete = true;

        dispatch({ type: ActionType.UPDATE_TRANSFER, value: {
            transferId: transfer.transferId,
            state: 'failed',
            progress: 1,
            speed: 0,
        } });
    };

    connection.addEventListener('datachannel', (event) => {
        dispatch({ type: ActionType.UPDATE_TRANSFER, value: {
            transferId: transfer.transferId,
            state: 'connected',
        } });

        const channel = event.channel;

        channel.binaryType = 'arraybuffer';
        channel.addEventListener('message', (event) => {
            buffer.push(event.data);
            offset += event.data.byteLength;

            dispatch({ type: ActionType.UPDATE_TRANSFER, value: {
                transferId: transfer.transferId,
                state: 'inprogress',
                progress: offset/transfer.fileSize,
                speed: offset/(new Date().getTime() / 1000 - timestamp),
            } });

            if (offset >= transfer.fileSize) {
                complete = true;
                channel.close();
            }
        });

        channel.addEventListener('close', () => {
            if (offset < transfer.fileSize) {
                onFailure();
                return;
            }

            const blob = new Blob(buffer);
            const blobUrl = URL.createObjectURL(blob);

            complete = true;
            dispatch({ type: ActionType.UPDATE_TRANSFER, value: {
                transferId: transfer.transferId,
                state: 'complete',
                progress: 1,
                speed: 0,
                time: Math.floor(new Date().getTime() / 1000 - timestamp),
                blobUrl: blobUrl,
            } });

            const element = document.createElement('a');
            element.setAttribute('href', blobUrl);
            element.setAttribute('download', transfer.fileName);

            element.style.display = 'none';
            element.click();

            connection.close();
        });
    });

    connection.addEventListener('iceconnectionstatechange', () => {
        if ((connection.iceConnectionState === 'failed' ||
            connection.iceConnectionState === 'disconnected') && !complete) {
            onFailure();
        }
    });

    yield call(async () => await connection.setRemoteDescription(rtcMessage.data));

    const answer = yield call(async () => await connection.createAnswer());
    yield call(async () => await connection.setLocalDescription(answer));

    const nextRtcMessage: RTCDescriptionMessageModel = {
        type: 'rtcDescription',
        transferId: transfer.transferId,
        targetId: transfer.clientId,
        data: {
            type: connection.localDescription.type,
            // Increase connection throughput on Chromium-based browsers.
            sdp: connection.localDescription.sdp.replace('b=AS:30', 'b=AS:1638400'),
        },
    };

    yield put({ type: ActionType.WS_SEND_MESSAGE, value: nextRtcMessage });
}