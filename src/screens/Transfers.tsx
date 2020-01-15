import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import { ActionType } from '../types/ActionType';
import { StateType } from '../reducers';
import Welcome from './Welcome';
import QrCodeSection from '../components/QrCodeSection';
import TransfersSection from '../components/TransfersSection';

const Transfers: React.FC = () => {
    const welcomed = useSelector((state: StateType) => state.welcomed);
    const { networkName } = useParams<{ networkName: string }>();
    const [ href, setHref ] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        setHref(window.location.origin + window.location.pathname + window.location.hash);
        dispatch({ type: ActionType.SET_NETWORK_NAME, value: networkName });
    }, [ setHref, networkName, dispatch ]);

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
        <>
            <AnimatePresence>
            { !welcomed ?
                <motion.div className="welcome" {...animationProps}>
                    <div>
                        <Welcome />
                        <div className="center">
                            <button onClick={dismissWelcome}>Continue</button>
                        </div>
                    </div>
                </motion.div>
            : null }
            </AnimatePresence>
            <section className="desktop-2col">
                <TransfersSection />
                <QrCodeSection href={href} />
            </section>
        </>
    );
}

export default Transfers;
