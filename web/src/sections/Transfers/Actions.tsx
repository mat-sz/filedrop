import React from 'react';

import styles from './Actions.module.scss';
import { TransferState } from '../../types/TransferState';
import { IconButton } from '../../components/IconButton';
import { IoCheckmarkDoneCircle, IoCloseCircle } from 'react-icons/io5';
import { Transfer } from '../../stores/Transfer';

interface Props {
  transfers: Transfer[];
}

export const Actions: React.FC<Props> = ({ transfers }) => {
  if (transfers.length <= 1) {
    return;
  }

  const acceptAll = () => {
    const acceptable = transfers.filter(
      transfer => transfer.state === TransferState.INCOMING
    );

    for (const transfer of acceptable) {
      transfer.accept();
    }
  };
  const cancelAll = () => {
    for (const transfer of transfers) {
      transfer.cancel();
    }
  };

  const hasAcceptable = !!transfers.find(
    transfer => transfer.state === TransferState.INCOMING
  );

  return (
    <>
      <div className={styles.actions}>
        {hasAcceptable && (
          <>
            <IconButton onClick={acceptAll}>
              <IoCheckmarkDoneCircle />
            </IconButton>
          </>
        )}
        <IconButton onClick={cancelAll}>
          <IoCloseCircle />
        </IconButton>
      </div>
    </>
  );
};
