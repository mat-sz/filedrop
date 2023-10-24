import React from 'react';
import { useTranslation } from 'react-i18not';

import styles from './ClipboardModal.module.scss';
import { Network } from '../components/Network.js';
import { networkStore } from '../stores/index.js';
import { observer } from 'mobx-react-lite';
import { Modal } from '../components/Modal.js';

interface ClipboardModalProps {
  files?: File[];
  dismissClipboard: () => void;
}

export const ClipboardModal: React.FC<ClipboardModalProps> = observer(
  ({ files = [], dismissClipboard }) => {
    const { t } = useTranslation();
    const fileNames = files.map(file => file.name).join(', ');
    const clients = networkStore.clients;

    const onSelect = (clientId: string) => {
      for (let file of files) {
        networkStore.createTransfer(file, clientId);
      }

      dismissClipboard();
    };

    return (
      <Modal
        onClose={dismissClipboard}
        title={t('clipboard.title')}
        isOpen={!!files.length}
      >
        <div className="subsection">
          <div className={styles.file}>
            {t('clipboard.body', { fileNames })}
          </div>
          <Network onSelect={onSelect} />
          {clients.length === 0 && <div>{t('emptyNetwork.title')}</div>}
        </div>
      </Modal>
    );
  }
);
