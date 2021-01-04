import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import { StateType } from '../reducers';
import QrCodeSection from '../components/QrCodeSection';
import TransfersSection from '../components/TransfersSection';
import IncompatibleBrowser from '../components/IncompatibleBrowser';
import ClipboardModal from '../modals/ClipboardModal';
import WelcomeModal from '../modals/WelcomeModal';
import { setNetworkNameAction } from '../actions/state';

const Transfers: React.FC = () => {
  const dispatch = useDispatch();
  const welcomed = useSelector((state: StateType) => state.welcomed);
  const [clipboardFiles, setClipboardFiles] = useState<File[]>([]);
  const { networkName } = useParams<{ networkName: string }>();
  const [href, setHref] = useState('');
  const [incompatibleBrowser, setIncompatibleBrowser] = useState(false);

  useEffect(() => {
    setHref(
      window.location.origin + window.location.pathname + window.location.hash
    );
    dispatch(setNetworkNameAction(networkName));
  }, [setHref, networkName, dispatch]);

  useEffect(() => {
    setIncompatibleBrowser(
      !(
        'RTCPeerConnection' in window &&
        'WebSocket' in window &&
        'FileReader' in window
      )
    );
  }, []);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const element = e.target as HTMLElement;
      if (element.tagName === 'TEXTAREA') {
        return;
      }

      const files = [];
      for (let item of e.clipboardData.items) {
        const file = item.getAsFile();

        if (file) {
          files.push(file);
        } else if (item.type === 'text/plain') {
          item.getAsString(str => {
            setClipboardFiles(files => [
              ...files,
              new File([str], 'clipboard.txt', { type: 'text/plain' }),
            ]);
          });
        }
      }

      setClipboardFiles(files);
    };

    document.addEventListener('paste', onPaste);

    return () => {
      document.removeEventListener('paste', onPaste);
    };
  });

  const dismissClipboard = useCallback(() => {
    setClipboardFiles([]);
  }, [setClipboardFiles]);

  return (
    <>
      {incompatibleBrowser ? <IncompatibleBrowser /> : null}
      <AnimatePresence>{!welcomed ? <WelcomeModal /> : null}</AnimatePresence>
      <AnimatePresence>
        {clipboardFiles.length > 0 ? (
          <ClipboardModal
            files={clipboardFiles}
            dismissClipboard={dismissClipboard}
          />
        ) : null}
      </AnimatePresence>
      <section className="desktop-2col">
        <TransfersSection />
        <QrCodeSection href={href} />
      </section>
    </>
  );
};

export default Transfers;
