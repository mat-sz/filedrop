import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';
import filesize from 'filesize';
import { FaCheck, FaCopy, FaDownload, FaTimes } from 'react-icons/fa';

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
import TransferIcon from './TransferIcon';
import { fileType } from '../../utils/file';

export const cancellableStates = [
  TransferState.IN_PROGRESS,
  TransferState.CONNECTING,
  TransferState.CONNECTED,
  TransferState.OUTGOING,
];

const types = {
  [FileType.UNKNOWN]: '',
  [FileType.TEXT]: 'Text file',
  [FileType.ARCHIVE]: 'Archive',
  [FileType.IMAGE]: 'Image',
  [FileType.VIDEO]: 'Video',
  [FileType.AUDIO]: 'Audio',
  [FileType.BINARY]: 'Binary file',
};

interface TransferProps {
  transfer: TransferModel;
}

function shorterFileName(
  name: string,
  fileNameLength = 32,
  replacementCharacter = '…'
) {
  const dotIndex = name.lastIndexOf('.');
  const half = Math.floor(fileNameLength / 2);

  if (dotIndex !== -1) {
    const extension = name.substr(dotIndex);
    const fileName = name.substr(0, dotIndex);

    if (fileName.length > fileNameLength) {
      return (
        fileName.substr(0, half) +
        replacementCharacter +
        fileName.substr(fileName.length - (half + 1)) +
        extension
      );
    }
  } else if (name.length > 24) {
    return (
      name.substr(0, half) +
      replacementCharacter +
      name.substr(name.length - (half + 1))
    );
  }

  return name;
}

const Transfer: React.FC<TransferProps> = ({ transfer }) => {
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
                {shorterFileName(transfer.fileName)}
              </div>
            </Tooltip>
            <div className="metadata">
              <span>{filesize(transfer.fileSize)}</span>
              {type !== FileType.UNKNOWN && <span>{types[type]}</span>}
              {transfer.state === TransferState.IN_PROGRESS && (
                <>
                  <span>{filesize(transfer.speed!)}/s</span>
                  <span>{Math.round(transfer.progress! * 100)}%</span>
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
                  <CopyToClipboard text={text}>
                    <button className="icon-button transfer-neutral">
                      <FaCopy />
                    </button>
                  </CopyToClipboard>
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
