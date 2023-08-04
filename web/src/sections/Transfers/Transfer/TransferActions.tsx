import React, { useEffect, useState } from 'react';
import {
  IoCheckmarkCircle,
  IoArrowDownCircle,
  IoCloseCircle,
  IoCopy,
} from 'react-icons/io5';
import { observer } from 'mobx-react-lite';

import styles from './TransferActions.module.scss';
import { TransferState } from '../../../types/TransferState';
import { copy } from '../../../utils/copy';
import { IconButton } from '../../../components/IconButton';
import { Transfer } from '../../../stores/Transfer';

interface TransferProps {
  transfer: Transfer;
}

export const TransferActions: React.FC<TransferProps> = observer(
  ({ transfer }) => {
    const [text, setText] = useState('');

    useEffect(() => {
      if (transfer.fileType === 'text/plain' && transfer.blobUrl) {
        fetch(transfer.blobUrl)
          .then(res => res.text())
          .then(text => setText(text));
      }
    }, [transfer]);

    return (
      <div className={styles.actions}>
        {transfer.state === TransferState.COMPLETE && transfer.blobUrl ? (
          <>
            <IconButton href={transfer.blobUrl} download={transfer.fileName}>
              <IoArrowDownCircle />
            </IconButton>
            {transfer.fileType === 'text/plain' ? (
              <IconButton
                onClick={() => copy(text)}
                round
                className={styles.copy}
              >
                <IoCopy />
              </IconButton>
            ) : null}
          </>
        ) : null}
        {transfer.state === TransferState.INCOMING ? (
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
