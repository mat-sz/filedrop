import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { ActionType } from '../types/ActionType';
import { TransferModel } from '../types/Models';

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
            <div>{ transfer.fileName }</div>
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
