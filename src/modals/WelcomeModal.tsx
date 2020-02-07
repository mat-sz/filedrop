import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

import { ActionType } from '../types/ActionType';
import Welcome from '../screens/Welcome';

const WelcomeModal: React.FC = () => {
    const dispatch = useDispatch();

    const dismissWelcome = useCallback(() => {
        dispatch({ type: ActionType.DISMISS_WELCOME });
    }, [ dispatch ]);

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
                <Welcome />
                <div className="center">
                    <button onClick={dismissWelcome}>Continue</button>
                </div>
            </div>
        </motion.div>
    );
}

export default WelcomeModal;
