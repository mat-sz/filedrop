import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { ActionType } from '../types/ActionType';
import { TransferModel } from '../types/Models';

const states = {
    connecting: 'Connecting...',
    connected: 'Connected!',
    inprogress: 'In progress...',
    complete: 'Complete!',
    failed: 'Failed!',
};

const Transfer: React.FC<{
    transfer: TransferModel,
    type: 'active' | 'incoming' | 'outgoing',
}> = ({ transfer, type }) => {
    const dispatch = useDispatch();

    const acceptTransfer = useCallback(() => dispatch({ type: ActionType.ACCEPT_TRANSFER, value: transfer.transferId }), [ transfer, dispatch ]);
    const rejectTransfer = useCallback(() => dispatch({ type: ActionType.REJECT_TRANSFER, value: transfer.transferId }), [ transfer, dispatch ]);
    const cancelTransfer = useCallback(() => dispatch({ type: ActionType.CANCEL_TRANSFER, value: transfer.transferId }), [ transfer, dispatch ]);

    return (
        <li key={transfer.transferId}>
            <div>
                { transfer.fileName }{ transfer.state ? ' - ' + states[transfer.state] : '' }
            </div>
            { type === 'active' && transfer.state === 'inprogress' ?
            <>
                <progress value={transfer.progress} max={1} />
                <div>{ Math.round(transfer.speed / 1000) } kB/s</div>
            </> : null }
            { type === 'active' && transfer.state === 'complete' ?
            <>
                <div>
                    <a className="button" href={transfer.blobUrl} download={transfer.fileName}>Redownload</a>
                </div>
            </> : null }
            { type === 'incoming' ? 
            <>
                <button onClick={acceptTransfer}>Accept</button>
                <button onClick={rejectTransfer}>Reject</button>
            </> : null }
            { type === 'outgoing' ?
            <>
                <button onClick={cancelTransfer}>Cancel</button>
            </> : null }
        </li>
    );
}

export default Transfer;
