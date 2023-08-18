import React from 'react';
import {
  IoCopy,
  IoCloseSharp,
  IoCheckmark,
  IoArrowDown,
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
            round
            href={transfer.blobUrl}
            download={transfer.fileName}
            title={t('download')}
          >
            <IoArrowDown />
          </IconButton>
        )}
        {transfer.canCopy && (
          <IconButton
            round
            onClick={() => transfer.copy()}
            className={styles.copy}
            title={t('copy')}
          >
            <IoCopy />
          </IconButton>
        )}
        {transfer.canAccept && (
          <IconButton
            round
            onClick={() => transfer.accept()}
            className={styles.positive}
            title={t('accept')}
          >
            <IoCheckmark />
          </IconButton>
        )}
        <IconButton
          round
          onClick={() => transfer.cancel()}
          className={styles.negative}
          title={t('cancel')}
        >
          <IoCloseSharp />
        </IconButton>
      </div>
    );
  }
);
