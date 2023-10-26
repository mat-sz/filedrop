import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18not';
import clsx from 'clsx';

import styles from './Home.module.scss';
import { applicationStore, connection, networkStore } from '../stores/index.js';
import { Footer } from '../components/Footer.js';
import { Modal } from '../components/Modal.js';
import { ClipboardModal } from '../modals/ClipboardModal.js';
import { IncompatibleBrowserSection } from '../sections/IncompatibleBrowser/index.js';
import { YourTileSection } from '../sections/YourTile/index.js';
import { NoticeSection } from '../sections/Notice/index.js';
import { NetworkSection } from '../sections/Network/index.js';
import { TransfersSection } from '../sections/Transfers/index.js';
import { ChatSection } from '../sections/Chat/index.js';
import { MobileTabs } from '../sections/MobileTabs/index.js';
import { SettingsSection } from '../sections/Settings/index.js';

const ConnectSection = React.lazy(() => import('../sections/Connect/index.js'));

function itemToString(item: DataTransferItem): Promise<string> {
  return new Promise(resolve => {
    item.getAsString(resolve);
  });
}

export const Home: React.FC = observer(() => {
  const { t } = useTranslation();
  const [clipboardFiles, setClipboardFiles] = useState<File[]>([]);
  const { networkName } = useParams<{ networkName: string }>();
  const tab = applicationStore.tab;

  useEffect(() => {
    if (networkName) {
      networkStore.updateNetworkName(networkName);
    }
  }, [networkName]);

  useEffect(() => {
    const onPaste = async (e: ClipboardEvent) => {
      if (!networkStore.clients.length) {
        return;
      }

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
          const str = await itemToString(item);
          files.push(new File([str], 'clipboard.txt', { type: 'text/plain' }));
        }
      }

      if (networkStore.clients.length === 1) {
        const clientId = networkStore.clients[0].clientId;
        for (const file of files) {
          networkStore.createTransfer(file, clientId);
        }
      } else {
        setClipboardFiles(files);
      }
    };

    document.addEventListener('paste', onPaste);

    return () => {
      document.removeEventListener('paste', onPaste);
    };
  }, [setClipboardFiles]);

  if (connection.disconnectReason) {
    return (
      <div className={clsx(styles.disconnected)}>
        <div className="subsection">
          <h2>{t('disconnected.title')}</h2>
          <div>
            <span>{t('disconnected.reason')}</span>{' '}
            {t(`disconnected.reasons.${connection.disconnectReason}`)}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const dismissClipboard = () => {
    setClipboardFiles([]);
  };

  const modal = applicationStore.modal;

  return (
    <>
      <ClipboardModal
        files={clipboardFiles}
        dismissClipboard={dismissClipboard}
      />
      <Modal
        onClose={() => applicationStore.closeModal()}
        title={t('tabs.settings')}
        isOpen={modal === 'settings'}
      >
        <SettingsSection />
      </Modal>
      <Modal
        onClose={() => applicationStore.closeModal()}
        title={t('tabs.connect')}
        isOpen={modal === 'connect'}
      >
        <ConnectSection />
      </Modal>
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
            className={clsx('desktopHidden', {
              mobileHidden: tab !== 'settings',
            })}
          >
            <SettingsSection />
          </div>
          <div
            className={clsx('desktopHidden', {
              mobileHidden: tab !== 'connect',
            })}
          >
            <Suspense>
              <ConnectSection />
            </Suspense>
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
