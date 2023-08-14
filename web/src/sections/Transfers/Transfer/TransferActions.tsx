import React from 'react';
import {
  IoCheckmarkCircle,
  IoArrowDownCircle,
  IoCloseCircle,
  IoCopy,
} from 'react-icons/io5/index.js';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18not';

import styles from './TransferActions.module.scss';
import { IconButton } from '../../../components/IconButton.js';
import { Transfer } from '../../../stores/Transfer.js';

interface TransferProps {
  transfer: Transfer;
}

export const TransferActions: React.FC<TransferProps> = observer(
  ({ transfer }) => {
    const { t } = useTranslation();

    return (
      <div className={styles.actions}>
        {transfer.canDownload && (
          <IconButton
            href={transfer.blobUrl}
            download={transfer.fileName}
            title={t('download')}
          >
            <IoArrowDownCircle />
          </IconButton>
        )}
        {transfer.canCopy && (
          <IconButton
            onClick={() => transfer.copy()}
            round
            className={styles.copy}
            title={t('copy')}
          >
            <IoCopy />
          </IconButton>
        )}
        {transfer.canAccept && (
          <IconButton
            onClick={() => transfer.accept()}
            className={styles.positive}
            title={t('accept')}
          >
            <IoCheckmarkCircle />
          </IconButton>
        )}
        <IconButton onClick={() => transfer.cancel()} title={t('cancel')}>
          <IoCloseCircle />
        </IconButton>
      </div>
    );
  }
);
