import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  IoCheckmarkCircle,
  IoArrowDownCircle,
  IoCloseCircle,
  IoCopy,
} from 'react-icons/io5';

import styles from './TransferActions.module.scss';
import {
  cancelTransferAction,
  acceptTransferAction,
} from '../../../actions/transfers';
import { TransferModel } from '../../../types/Models';
import { TransferState } from '../../../types/TransferState';
import { copy } from '../../../utils/copy';
import { IconButton } from '../../../components/IconButton';

interface TransferProps {
  transfer: TransferModel;
}

export const TransferActions: React.FC<TransferProps> = ({ transfer }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const acceptTransfer = () =>
    dispatch(acceptTransferAction(transfer.transferId));
  const cancelTransfer = () =>
    dispatch(cancelTransferAction(transfer.transferId));

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
        <IconButton onClick={acceptTransfer} className={styles.positive}>
          <IoCheckmarkCircle />
        </IconButton>
      ) : null}
      <IconButton onClick={cancelTransfer}>
        <IoCloseCircle />
      </IconButton>
    </div>
  );
};
