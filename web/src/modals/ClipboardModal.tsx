import React from 'react';
import { useTranslation } from 'react-i18not';
import { motion } from 'nanoanim';
import { IoClose } from 'react-icons/io5';

import styles from './ClipboardModal.module.scss';
import { animationPropsOpacity } from '../animationSettings';
import { Network } from '../components/Network';
import { IconButton } from '../components/IconButton';
import { applicationStore } from '../stores/ApplicationStore';

interface ClipboardModalProps {
  files: File[];
  dismissClipboard: () => void;
}

export const ClipboardModal: React.FC<ClipboardModalProps> = ({
  files,
  dismissClipboard,
}) => {
  const { t } = useTranslation();
  const fileNames = files.map((file, i) => file.name).join(', ');

  const onSelect = (clientId: string) => {
    for (let file of files) {
      applicationStore.networkStore.createTransfer(file, clientId);
    }

    dismissClipboard();
  };

  return (
    <motion.div
      className={styles.modal}
      onClick={dismissClipboard}
      {...animationPropsOpacity}
    >
      <div className="subsection" onClick={e => e.stopPropagation()}>
        <h2>
          {t('clipboard.title')}
          <IconButton onClick={dismissClipboard}>
            <IoClose />
          </IconButton>
        </h2>
        <p>{t('clipboard.body', { fileNames })}</p>
        <Network onSelect={onSelect} />
      </div>
    </motion.div>
  );
};
