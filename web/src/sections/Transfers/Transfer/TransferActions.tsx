import React from 'react';
import {
  IoCheckmarkCircle,
  IoArrowDownCircle,
  IoCloseCircle,
  IoCopy,
} from 'react-icons/io5/index.js';
import { observer } from 'mobx-react-lite';

import styles from './TransferActions.module.scss';
import { copy } from '../../../utils/copy.js';
import { IconButton } from '../../../components/IconButton.js';
import { Transfer } from '../../../stores/Transfer.js';

interface TransferProps {
  transfer: Transfer;
}

export const TransferActions: React.FC<TransferProps> = observer(
  ({ transfer }) => {
    return (
      <div className={styles.actions}>
        {transfer.blobUrl ? (
          <>
            <IconButton href={transfer.blobUrl} download={transfer.fileName}>
              <IoArrowDownCircle />
            </IconButton>
            {transfer.text ? (
              <IconButton
                onClick={() => copy(transfer.text!)}
                round
                className={styles.copy}
              >
                <IoCopy />
              </IconButton>
            ) : null}
          </>
        ) : null}
        {transfer.canAccept ? (
          <IconButton
            onClick={() => transfer.accept()}
            className={styles.positive}
          >
            <IoCheckmarkCircle />
          </IconButton>
        ) : null}
        <IconButton onClick={() => transfer.cancel()}>
          <IoCloseCircle />
        </IconButton>
      </div>
    );
  }
);
