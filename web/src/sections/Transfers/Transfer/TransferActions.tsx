import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaCheck, FaCopy, FaDownload, FaTimes } from 'react-icons/fa';

import styles from './TransferActions.module.scss';
import {
  removeTransferAction,
  cancelTransferAction,
  rejectTransferAction,
  acceptTransferAction,
} from '../../../actions/transfers';
import { TransferModel } from '../../../types/Models';
import { TransferState } from '../../../types/TransferState';
import { copy } from '../../../utils/copy';
import { IconButton } from '../../../components/IconButton';

export const cancellableStates = [
  TransferState.IN_PROGRESS,
  TransferState.CONNECTING,
  TransferState.CONNECTED,
  TransferState.OUTGOING,
];

interface TransferProps {
  transfer: TransferModel;
}

export const TransferActions: React.FC<TransferProps> = ({ transfer }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const acceptTransfer = () =>
    dispatch(acceptTransferAction(transfer.transferId));
  const rejectTransfer = () =>
    dispatch(rejectTransferAction(transfer.transferId));
  const cancelTransfer = () =>
    dispatch(cancelTransferAction(transfer.transferId));
  const dismissTransfer = () =>
    dispatch(removeTransferAction(transfer.transferId));

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
            <FaDownload />
          </IconButton>
          {transfer.fileType === 'text/plain' ? (
            <IconButton onClick={() => copy(text)}>
              <FaCopy />
            </IconButton>
          ) : null}
        </>
      ) : null}
      {transfer.state === TransferState.COMPLETE ||
      transfer.state === TransferState.FAILED ? (
        <IconButton onClick={dismissTransfer}>
          <FaTimes />
        </IconButton>
      ) : null}
      {transfer.state === TransferState.INCOMING ? (
        <>
          <IconButton onClick={acceptTransfer} className={styles.positive}>
            <FaCheck />
          </IconButton>
          <IconButton onClick={rejectTransfer} className={styles.negative}>
            <FaTimes />
          </IconButton>
        </>
      ) : null}
      {cancellableStates.includes(transfer.state) ? (
        <IconButton onClick={cancelTransfer} className={styles.negative}>
          <FaTimes />
        </IconButton>
      ) : null}
    </div>
  );
};
