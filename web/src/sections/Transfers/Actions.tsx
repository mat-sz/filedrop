import React from 'react';
import { useDispatch } from 'react-redux';

import styles from './Actions.module.scss';
import {
  acceptTransferAction,
  cancelTransferAction,
} from '../../actions/transfers';
import { TransferState } from '../../types/TransferState';
import { IconButton } from '../../components/IconButton';
import { IoCheckmarkDoneCircle, IoCloseCircle } from 'react-icons/io5';
import { TransferModel } from '../../types/Models';

interface Props {
  transfers: TransferModel[];
}

export const Actions: React.FC<Props> = ({ transfers }) => {
  const dispatch = useDispatch();

  if (transfers.length <= 1) {
    return;
  }

  const acceptAll = () => {
    const acceptable = transfers.filter(
      transfer => transfer.state === TransferState.INCOMING
    );

    for (const transfer of acceptable) {
      dispatch(acceptTransferAction(transfer.transferId));
    }
  };
  const cancelAll = () => {
    for (const transfer of transfers) {
      dispatch(cancelTransferAction(transfer.transferId));
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
