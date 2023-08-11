import React from 'react';

import styles from './Actions.module.scss';
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
