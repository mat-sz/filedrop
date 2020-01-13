import React from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

import { StateType } from '../reducers';

const Status: React.FC = () => {
    const connected = useSelector((state: StateType) => state.connected);

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
        <AnimatePresence>
            { !connected ?
                <motion.div {...animationProps} className="status error">
                    <div>Connecting...</div>
                </motion.div>
            : null }
        </AnimatePresence>
    );
}

export default Status;
