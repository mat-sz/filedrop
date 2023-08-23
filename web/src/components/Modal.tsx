import React from 'react';
import { IoClose } from 'react-icons/io5/index.js';
import { useTranslation } from 'react-i18not';

import styles from './Modal.module.scss';
import { IconButton } from './IconButton.js';
import { Portal } from './Portal.js';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: (data: any, methods: { reset: () => void }) => void;
  showCancelButton?: boolean;
  submitButtonLabel?: React.ReactNode;
  submitButtonVariant?: 'primary' | 'danger' | 'success';
  isLoading?: boolean;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  secondaryActions?: React.ReactNode;
}

export const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Portal isOpen={isOpen}>
      <div
        className={styles.overlay}
        onClick={e => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className={styles.modal}>
          <div className={styles.title}>
            <h2>{title}</h2>
            <IconButton title={t('close')} onClick={onClose}>
              <IoClose />
            </IconButton>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </Portal>
  );
};
