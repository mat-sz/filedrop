import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import { ActionType } from '../types/ActionType';
import { StateType } from '../reducers';
import Welcome from './Welcome';
import QrCodeSection from '../components/QrCodeSection';
import TransfersSection from '../components/TransfersSection';
import IncompatibleBrowser from '../components/IncompatibleBrowser';
import ClipboardModal from '../components/ClipboardModal';

const Transfers: React.FC = () => {
    const dispatch = useDispatch();
    const welcomed = useSelector((state: StateType) => state.welcomed);
    const [ clipboardFiles, setClipboardFiles ] = useState<File[]>([]);
    const { networkName } = useParams<{ networkName: string }>();
    const [ href, setHref ] = useState('');
    const [ incompatibleBrowser, setIncompatibleBrowser ] = useState(false);

    useEffect(() => {
        setHref(window.location.origin + window.location.pathname + window.location.hash);
        dispatch({ type: ActionType.SET_NETWORK_NAME, value: networkName });
    }, [ setHref, networkName, dispatch ]);

    useEffect(() => {
        setIncompatibleBrowser(!(('RTCPeerConnection' in window) && ('WebSocket' in window)));
    }, []);

    useEffect(() => {
        const onPaste = (e: ClipboardEvent) => {
            let files = [];
            for (let item of e.clipboardData.items) {
                const file = item.getAsFile();

                if (file) {
                    files.push(file);
                } else if (item.type === 'text/plain') {
                    item.getAsString((str) => {
                        setClipboardFiles((files) => [...files,
                            new File([ str ], "clipboard.txt", { type: "text/plain" })
                        ]);
                    });
                }
            }
            
            setClipboardFiles(files);
        };

        document.addEventListener('paste', onPaste);

        return () => {
            document.removeEventListener('paste', onPaste);
        }
    });

    const dismissWelcome = useCallback(() => {
        dispatch({ type: ActionType.DISMISS_WELCOME });
    }, [ dispatch ]);

    const dismissClipboard = useCallback(() => {
        setClipboardFiles([]);
    }, [ setClipboardFiles ]);

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
            { incompatibleBrowser ? <IncompatibleBrowser /> : null }
            <AnimatePresence>
            { !welcomed ?
                <motion.div className="modal" {...animationProps}>
                    <div>
                        <Welcome />
                        <div className="center">
                            <button onClick={dismissWelcome}>Continue</button>
                        </div>
                    </div>
                </motion.div>
            : null }
            </AnimatePresence>
            <AnimatePresence>
            { clipboardFiles.length > 0 ?
                <ClipboardModal
                    files={clipboardFiles}
                    dismissClipboard={dismissClipboard}
                />
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
