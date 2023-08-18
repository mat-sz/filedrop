import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'nanoanim';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import styles from './Home.module.scss';
import { ClipboardModal } from '../modals/ClipboardModal.js';
import { IncompatibleBrowserSection } from '../sections/IncompatibleBrowser/index.js';
import { YourTileSection } from '../sections/YourTile/index.js';
import { NoticeSection } from '../sections/Notice/index.js';
import { NetworkSection } from '../sections/Network/index.js';
import { TransfersSection } from '../sections/Transfers/index.js';
import { ConnectSection } from '../sections/Connect/index.js';
import { ChatSection } from '../sections/Chat/index.js';
import { MobileTabs } from '../sections/MobileTabs/index.js';
import { applicationStore, networkStore } from '../stores/index.js';
import { Footer } from '../components/Footer.js';

export const Home: React.FC = observer(() => {
  const [clipboardFiles, setClipboardFiles] = useState<File[]>([]);
  const { networkName } = useParams<{ networkName: string }>();
  const tab = applicationStore.tab;

  useEffect(() => {
    if (networkName) {
      networkStore.updateNetworkName(networkName);
    }
  }, [networkName]);

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
            className={clsx({
              mobileHidden: tab !== 'connect',
            })}
          >
            <ConnectSection />
          </div>
          <div
            className={clsx('mobileFlex', {
              mobileHidden: tab !== 'chat',
            })}
          >
            <ChatSection />
          </div>
          {tab !== 'chat' && <Footer />}
        </div>
      </div>
      <MobileTabs />
    </>
  );
});
