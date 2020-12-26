import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from 'rc-tooltip';
import filesize from 'filesize';

import {
  removeTransferAction,
  cancelTransferAction,
  rejectTransferAction,
  acceptTransferAction,
} from '../actions/transfers';
import { TransferModel } from '../types/Models';
import { TransferState } from '../types/TransferState';
import TransferIcon from './TransferIcon';
import { animationPropsSlide } from '../animationSettings';

export const cancellableStates = [
  TransferState.IN_PROGRESS,
  TransferState.CONNECTING,
  TransferState.CONNECTED,
  TransferState.OUTGOING,
];

interface TransferProps {
  transfer: TransferModel;
}

function shorterFileName(
  name: string,
  fileNameLength = 20,
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
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState('');

  const acceptTransfer = useCallback(
    () => dispatch(acceptTransferAction(transfer.transferId)),
    [transfer, dispatch]
  );
  const rejectTransfer = useCallback(
    () => dispatch(rejectTransferAction(transfer.transferId)),
    [transfer, dispatch]
  );
  const cancelTransfer = useCallback(
    () => dispatch(cancelTransferAction(transfer.transferId)),
    [transfer, dispatch]
  );
  const dismissTransfer = useCallback(
    () => dispatch(removeTransferAction(transfer.transferId)),
    [transfer, dispatch]
  );

  useEffect(() => {
    setCopied(false);
  }, [transfer.blobUrl, setCopied]);

  useEffect(() => {
    if (transfer.fileType === 'text/plain' && transfer.blobUrl) {
      fetch(transfer.blobUrl)
        .then(res => res.text())
        .then(text => setText(text));
    }
  }, [transfer]);

  const onCopy = useCallback(() => setCopied(true), [setCopied]);

  return (
    <motion.li
      className="subsection info-grid"
      {...animationPropsSlide}
      aria-label="Transfer"
    >
      <div className="image">
        <TransferIcon transfer={transfer} />
      </div>
      <div className="info">
        <div>
          <Tooltip
            placement="top"
            overlay={transfer.fileName}
            transitionName="rc-tooltip-fade"
          >
            <div className="metadata">
              {shorterFileName(transfer.fileName)}
              <span> ({filesize(transfer.fileSize)})</span>
            </div>
          </Tooltip>
          <div className="metadata">
            {transfer.state === TransferState.FAILED ? 'Failed!' : ''}
          </div>
        </div>
        <div className="actions">
          <div className="buttons">
            {transfer.state === TransferState.COMPLETE && transfer.blobUrl ? (
              <>
                <a
                  className="button"
                  href={transfer.blobUrl}
                  download={transfer.fileName}
                >
                  Redownload
                </a>
                {transfer.fileType === 'text/plain' ? (
                  <CopyToClipboard text={text} onCopy={onCopy}>
                    <button>{copied ? 'Copied' : 'Copy to clipboard'}</button>
                  </CopyToClipboard>
                ) : null}
              </>
            ) : null}
            {transfer.state === TransferState.COMPLETE ||
            transfer.state === TransferState.FAILED ? (
              <button onClick={dismissTransfer}>Dismiss</button>
            ) : null}
            {transfer.state === TransferState.INCOMING ? (
              <>
                <button onClick={acceptTransfer}>Accept</button>
                <button onClick={rejectTransfer}>Reject</button>
              </>
            ) : null}
            {cancellableStates.includes(transfer.state) ? (
              <button onClick={cancelTransfer}>Cancel</button>
            ) : null}
          </div>
          <AnimatePresence>
            {transfer.state === TransferState.IN_PROGRESS ? (
              <motion.div className="progress" {...animationPropsSlide}>
                <progress value={transfer.progress} max={1} />
                <div>{Math.round(transfer.speed / 1000)} kB/s</div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.li>
  );
};

export default Transfer;
