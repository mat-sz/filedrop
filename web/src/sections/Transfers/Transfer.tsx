import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaCopy, FaDownload, FaTimes } from 'react-icons/fa';

import styles from './Transfer.module.scss';
import {
  removeTransferAction,
  cancelTransferAction,
  rejectTransferAction,
  acceptTransferAction,
} from '../../actions/transfers';
import { animationPropsSlide } from '../../animationSettings';
import { TransferModel } from '../../types/Models';
import { TransferState } from '../../types/TransferState';
import { motion } from '../../animate';
import { formatFileName, formatFileSize } from '../../utils/file';
import { humanTimeLeft } from '../../utils/time';
import { copy } from '../../utils/copy';
import { Tooltip } from '../../components/Tooltip';
import { TransferIcon } from './TransferIcon';
import { TransferTarget } from './TransferTarget';
import { IconButton } from '../../components/IconButton';

export const cancellableStates = [
  TransferState.IN_PROGRESS,
  TransferState.CONNECTING,
  TransferState.CONNECTED,
  TransferState.OUTGOING,
];

interface TransferProps {
  transfer: TransferModel;
}

export const Transfer: React.FC<TransferProps> = ({ transfer }) => {
  const { t } = useTranslation();
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

  const formattedOffset = transfer.offset && formatFileSize(transfer.offset);
  const formattedSize = formatFileSize(transfer.fileSize);

  return (
    <motion.li
      className={clsx(styles.transfer, 'info-grid')}
      {...animationPropsSlide}
      aria-label="Transfer"
    >
      <TransferIcon transfer={transfer} />
      <div className={styles.info}>
        <div className={styles.state}>
          <div className={styles.filename}>
            <TransferTarget transfer={transfer} />
            <Tooltip content={transfer.fileName}>
              <span>{formatFileName(transfer.fileName)}</span>
            </Tooltip>
          </div>
          {transfer.state === TransferState.IN_PROGRESS ? (
            <div>
              <progress
                value={(transfer.offset || 0) / transfer.fileSize}
                max={1}
              />
            </div>
          ) : null}
          <div className={styles.metadata}>
            <div>
              <span>
                {formattedOffset
                  ? t('transfers.progress', {
                      offset: formattedOffset,
                      size: formattedSize,
                    })
                  : formattedSize}
              </span>
              {transfer.state === TransferState.FAILED && <span>Failed!</span>}
            </div>
            {transfer.state === TransferState.IN_PROGRESS && (
              <div className={styles.progress}>
                <span>{formatFileSize(transfer.speed!)}/s</span>
                <span>{humanTimeLeft(transfer.timeLeft)}</span>
              </div>
            )}
          </div>
        </div>
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
      </div>
    </motion.li>
  );
};
