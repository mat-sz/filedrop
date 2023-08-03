import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'nanoanim';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import styles from './Home.module.scss';
import { ClipboardModal } from '../modals/ClipboardModal';
import { setNetworkNameAction } from '../actions/state';
import { IncompatibleBrowserSection } from '../sections/IncompatibleBrowser';
import { YourTileSection } from '../sections/YourTile';
import { NoticeSection } from '../sections/Notice';
import { NetworkSection } from '../sections/Network';
import { TransfersSection } from '../sections/Transfers';
import { ConnectSection } from '../sections/Connect';
import { ChatSection } from '../sections/Chat';
import { MobileTabs } from '../sections/MobileTabs';
import { StateType } from '../reducers';

export const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [clipboardFiles, setClipboardFiles] = useState<File[]>([]);
  const { networkName } = useParams<{ networkName: string }>();
  const [href, setHref] = useState('');
  const tab = useSelector((state: StateType) => state.tab);

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
      <AnimatePresence>
        {clipboardFiles.length > 0 && (
          <ClipboardModal
            files={clipboardFiles}
            dismissClipboard={dismissClipboard}
          />
        )}
      </AnimatePresence>
      <div className={clsx('mobileFlex', styles.home)}>
        <div className={clsx({ mobileHidden: tab !== 'transfers' })}>
          <IncompatibleBrowserSection />
          <NoticeSection />
          <YourTileSection />
          <NetworkSection />
          <TransfersSection />
        </div>
        <div className="mobileFlex">
          <div
            className={clsx('mobileFlex', {
              mobileHidden: tab !== 'connect',
            })}
          >
            <ConnectSection href={href} />
          </div>
          <div
            className={clsx('mobileFlex', {
              mobileHidden: tab !== 'chat',
            })}
          >
            <ChatSection />
          </div>
        </div>
      </div>
      <MobileTabs />
    </>
  );
};