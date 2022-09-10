import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaCheck, FaCopy, FaDownload, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import {
  removeTransferAction,
  cancelTransferAction,
  rejectTransferAction,
  acceptTransferAction,
} from '../../actions/transfers';
import { animationPropsSlide } from '../../animationSettings';
import { TransferModel } from '../../types/Models';
import { TransferState } from '../../types/TransferState';
import { FileType } from '../../types/FileType';
import Tooltip from '../../components/Tooltip';
import Animate from '../../components/Animate';
import { fileType, formatFileName, formatFileSize } from '../../utils/file';
import { humanTimeLeft } from '../../utils/time';
import { copy } from '../../utils/copy';
import TransferIcon from './TransferIcon';

export const cancellableStates = [
  TransferState.IN_PROGRESS,
  TransferState.CONNECTING,
  TransferState.CONNECTED,
  TransferState.OUTGOING,
];

interface TransferProps {
  transfer: TransferModel;
}

const Transfer: React.FC<TransferProps> = ({ transfer }) => {
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

  const type = fileType(transfer.fileType);

  return (
    <Animate
      component="li"
      className="subsection info-grid"
      {...animationPropsSlide}
      aria-label="Transfer"
    >
      <div className="image">
        <TransferIcon transfer={transfer} />
      </div>
      <div className="info">
        <div className="space-between">
          <div className="transfer-info">
            <Tooltip content={transfer.fileName}>
              <div className="filename">
                {formatFileName(transfer.fileName)}
              </div>
            </Tooltip>
            <div className="metadata">
              <span>{formatFileSize(transfer.fileSize)}</span>
              {type !== FileType.UNKNOWN && (
                <span>{t(`fileType.${type}`)}</span>
              )}
              {transfer.state === TransferState.IN_PROGRESS && (
                <>
                  <div>
                    <span>{formatFileSize(transfer.speed!)}/s</span>
                    <span>{Math.round(transfer.progress! * 100)}%</span>
                    <span>{humanTimeLeft(transfer.timeLeft)}</span>
                  </div>
                </>
              )}
              {transfer.state === TransferState.FAILED && <span>Failed!</span>}
            </div>
            {transfer.state === TransferState.IN_PROGRESS ? (
              <div>
                <progress value={transfer.progress} max={1} />
              </div>
            ) : null}
          </div>
          <div className="actions">
            {transfer.state === TransferState.COMPLETE && transfer.blobUrl ? (
              <>
                <a
                  className="button icon-button transfer-neutral"
                  href={transfer.blobUrl}
                  download={transfer.fileName}
                >
                  <FaDownload />
                </a>
                {transfer.fileType === 'text/plain' ? (
                  <button
                    className="icon-button transfer-neutral"
                    onClick={() => copy(text)}
                  >
                    <FaCopy />
                  </button>
                ) : null}
              </>
            ) : null}
            {transfer.state === TransferState.COMPLETE ||
            transfer.state === TransferState.FAILED ? (
              <button
                onClick={dismissTransfer}
                className="icon-button transfer-neutral"
              >
                <FaTimes />
              </button>
            ) : null}
            {transfer.state === TransferState.INCOMING ? (
              <>
                <button
                  onClick={acceptTransfer}
                  className="icon-button transfer-positive"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={rejectTransfer}
                  className="icon-button transfer-negative"
                >
                  <FaTimes />
                </button>
              </>
            ) : null}
            {cancellableStates.includes(transfer.state) ? (
              <button
                onClick={cancelTransfer}
                className="icon-button transfer-negative"
              >
                <FaTimes />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Animate>
  );
};

export default Transfer;
