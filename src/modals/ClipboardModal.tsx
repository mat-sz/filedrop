import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

import Network from '../components/Network';
import { createTransferAction } from '../actions/transfers';

const ClipboardModal: React.FC<{
    files: File[],
    dismissClipboard: () => void,
}> = ({ files, dismissClipboard }) => {
    const dispatch = useDispatch();

    const onSelect = useCallback((clientId: string) => {
        for (let file of files) {
            dispatch(createTransferAction(file, clientId));
        }

        dismissClipboard();
    }, [ dispatch, files, dismissClipboard ]);

    const animationProps = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
        },
    };

    return (
        <motion.div className="modal" {...animationProps}>
            <div>
                <section>
                    <h2>Send clipboard contents</h2>
                    <Network onSelect={onSelect} />
                </section>
                <div className="center">
                    <button onClick={dismissClipboard}>Cancel</button>
                </div>
            </div>
        </motion.div>
    );
}

export default ClipboardModal;
