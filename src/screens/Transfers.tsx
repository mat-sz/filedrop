import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import ChatSection from '../sections/Chat';
import ConnectSection from '../sections/Connect';
import TransfersSection from '../sections/Transfers';
import OtherNetworksSection from '../sections/OtherNetworks';
import IncompatibleBrowser from '../components/IncompatibleBrowser';
import ClipboardModal from '../modals/ClipboardModal';
import { setNetworkNameAction } from '../actions/state';
import { isBrowserCompatible } from '../utils/browser';

const Transfers: React.FC = () => {
  const dispatch = useDispatch();
  const [clipboardFiles, setClipboardFiles] = useState<File[]>([]);
  const { networkName } = useParams<{ networkName: string }>();
  const [href, setHref] = useState('');

  useEffect(() => {
    setHref(
      window.location.origin + window.location.pathname + window.location.hash
    );

    if (networkName) {
      dispatch(setNetworkNameAction(networkName));
    }
  }, [setHref, networkName, dispatch]);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const element = e.target as HTMLElement;
      if (
        document.body.contains(element) &&
        (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT')
      ) {
        return;
      }

      const files = [];
      for (let item of e.clipboardData!.items) {
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

  const dismissClipboard = () => {
    setClipboardFiles([]);
  };

  return (
    <>
      {!isBrowserCompatible ? <IncompatibleBrowser /> : null}
      <AnimatePresence>
        {clipboardFiles.length > 0 && (
          <ClipboardModal
            files={clipboardFiles}
            dismissClipboard={dismissClipboard}
          />
        )}
      </AnimatePresence>
      <section className="desktop-2col">
        <TransfersSection />
        <div>
          <ConnectSection href={href} />
          <OtherNetworksSection />
          <ChatSection />
        </div>
      </section>
    </>
  );
};

export default Transfers;
