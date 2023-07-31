import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

import styles from './ClipboardModal.module.scss';
import { motion } from '../animate';
import { createTransferAction } from '../actions/transfers';
import { animationPropsOpacity } from '../animationSettings';
import { Network } from '../components/Network';
import { IconButton } from '../components/IconButton';

interface ClipboardModalProps {
  files: File[];
  dismissClipboard: () => void;
}

export const ClipboardModal: React.FC<ClipboardModalProps> = ({
  files,
  dismissClipboard,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fileNames = files.map((file, i) => file.name).join(', ');

  const onSelect = (clientId: string) => {
    for (let file of files) {
      dispatch(createTransferAction(file, clientId));
    }

    dismissClipboard();
  };

  return (
    <motion.div className={styles.modal} {...animationPropsOpacity}>
      <div>
        <div className="subsection left">
          <h2>
            {t('clipboard.title')}
            <IconButton onClick={dismissClipboard}>
              <FaTimes />
            </IconButton>
          </h2>
          <p>{t('clipboard.body', { fileNames })}</p>
          <Network onSelect={onSelect} />
        </div>
      </div>
    </motion.div>
  );
};
