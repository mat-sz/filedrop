import React from 'react';
import { IoCheckmarkDone, IoClose } from 'react-icons/io5';
import { useTranslation } from 'react-i18not';

import styles from './Actions.module.scss';
import { IconButton } from '../../components/IconButton.js';
import { Transfer } from '../../stores/Transfer.js';

interface Props {
  transfers: Transfer[];
}

export const Actions: React.FC<Props> = ({ transfers }) => {
  const { t } = useTranslation();

  if (transfers.length <= 1) {
    return null;
  }

  const acceptAll = () => {
    for (const transfer of transfers) {
      transfer.accept();
    }
  };
  const cancelAll = () => {
    for (const transfer of transfers) {
      transfer.cancel();
    }
  };

  const hasAcceptable = transfers.some(transfer => transfer.canAccept);

  return (
    <>
      <div className={styles.actions}>
        {hasAcceptable && (
          <IconButton round onClick={acceptAll} title={t('acceptAll')}>
            <IoCheckmarkDone />
          </IconButton>
        )}
        <IconButton round onClick={cancelAll} title={t('cancelAll')}>
          <IoClose />
        </IconButton>
      </div>
    </>
  );
};
