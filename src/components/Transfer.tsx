import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

import { ActionType } from '../types/ActionType';
import { TransferModel } from '../types/Models';
import { TransferState } from '../types/TransferState';

const states = {
    [TransferState.INCOMING]: 'Incoming',
    [TransferState.OUTGOING]: 'Outgoing',
    [TransferState.CONNECTING]: 'Connecting...',
    [TransferState.CONNECTED]: 'Connected!',
    [TransferState.IN_PROGRESS]: 'In progress...',
    [TransferState.COMPLETE]: 'Complete!',
    [TransferState.FAILED]: 'Failed!',
};

const cancellableStates = [
    TransferState.IN_PROGRESS,
    TransferState.CONNECTING,
    TransferState.CONNECTED,
    TransferState.OUTGOING,
];

const Transfer: React.FC<{
    transfer: TransferModel,
}> = ({ transfer }) => {
    const dispatch = useDispatch();

    const acceptTransfer = useCallback(() => dispatch({ type: ActionType.ACCEPT_TRANSFER, value: transfer.transferId }), [ transfer, dispatch ]);
    const rejectTransfer = useCallback(() => dispatch({ type: ActionType.REJECT_TRANSFER, value: transfer.transferId }), [ transfer, dispatch ]);
    const cancelTransfer = useCallback(() => dispatch({ type: ActionType.CANCEL_TRANSFER, value: transfer.transferId }), [ transfer, dispatch ]);
    const dismissTransfer = useCallback(() => dispatch({ type: ActionType.REMOVE_TRANSFER, value: transfer.transferId }), [ transfer, dispatch ]);

    const animationProps = {
        initial: { scale: 0 },
        animate: { scale: 1 },
        exit: { scale: 0 },
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
        },
        positionTransition: true,
    };

    return (
        <motion.li className="subsection" {...animationProps}>
            <div>
                { transfer.fileName }{ transfer.state ? ' - ' + states[transfer.state] : '' }
            </div>
            { transfer.state === TransferState.IN_PROGRESS ?
            <>
                <progress value={transfer.progress} max={1} />
                <div>{ Math.round(transfer.speed / 1000) } kB/s</div>
            </> : null }
            { transfer.state === TransferState.COMPLETE && transfer.blobUrl ? 
                <a className="button" href={transfer.blobUrl} download={transfer.fileName}>Redownload</a>
            : null }
            { transfer.state === TransferState.COMPLETE || transfer.state === TransferState.FAILED ?
                <button onClick={dismissTransfer}>Dismiss</button>
            : null }
            { transfer.state === TransferState.INCOMING ? 
            <>
                <button onClick={acceptTransfer}>Accept</button>
                <button onClick={rejectTransfer}>Reject</button>
            </> : null }
            { cancellableStates.includes(transfer.state) ?
                <button onClick={cancelTransfer}>Cancel</button>
            : null }
        </motion.li>
    );
}

export default Transfer;
