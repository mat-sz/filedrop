import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';
import { motion } from 'framer-motion';

import { removeTransferAction, cancelTransferAction, rejectTransferAction, acceptTransferAction } from '../actions/transfers';
import { TransferModel } from '../types/Models';
import { TransferState } from '../types/TransferState';
import TransferIcon from './TransferIcon';

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
    const [ copied, setCopied ] = useState(false);
    const [ text, setText ] = useState('');
    
    const acceptTransfer = useCallback(() => dispatch(acceptTransferAction(transfer.transferId)), [ transfer, dispatch ]);
    const rejectTransfer = useCallback(() => dispatch(rejectTransferAction(transfer.transferId)), [ transfer, dispatch ]);
    const cancelTransfer = useCallback(() => dispatch(cancelTransferAction(transfer.transferId)), [ transfer, dispatch ]);
    const dismissTransfer = useCallback(() => dispatch(removeTransferAction(transfer.transferId)), [ transfer, dispatch ]);

    useEffect(() => {
        setCopied(false);
    }, [ transfer.blobUrl, setCopied ]);

    useEffect(() => {
        if (transfer.fileType === 'text/plain' && transfer.blobUrl) {
            fetch(transfer.blobUrl)
                .then((res) => res.text())
                .then((text) => setText(text));
        }
    }, [ transfer ]);

    const onCopy = useCallback(() => setCopied(true), [ setCopied ]);

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
        <motion.li className="subsection info-grid" {...animationProps}>
            <TransferIcon transfer={transfer} />
            <div className="info">
                <div className="metadata">
                    { transfer.fileName }
                </div>
                <div className="metadata">
                    { transfer.state === TransferState.FAILED ? 'Failed!' : '' }
                </div>
                { transfer.state === TransferState.IN_PROGRESS ?
                <div className="progress">
                    <progress value={transfer.progress} max={1} />
                    <div>{ Math.round(transfer.speed / 1000) } kB/s</div>
                </div> : null }
                <div className="buttons">
                { transfer.state === TransferState.COMPLETE && transfer.blobUrl ?
                <>
                    <a className="button" href={transfer.blobUrl} download={transfer.fileName}>Redownload</a>
                    { transfer.fileType === 'text/plain' ?
                        <CopyToClipboard
                            text={text}
                            onCopy={onCopy}
                        >
                            <button>
                                { copied ? 'Copied' : 'Copy to clipboard' }
                            </button>
                        </CopyToClipboard>
                    : null }
                </>
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
                </div>
            </div>
        </motion.li>
    );
}

export default Transfer;
