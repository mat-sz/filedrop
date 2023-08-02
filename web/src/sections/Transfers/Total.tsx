import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18not';
import { createSelector } from 'reselect';
import { IoArrowDown, IoArrowUp } from 'react-icons/io5';

import styles from './Total.module.scss';
import { StateType } from '../../reducers';
import { formatFileSize } from '../../utils/file';
import { TransferState } from '../../types/TransferState';

const activeTransfersSelector = createSelector(
  [(state: StateType) => state.transfers],
  transfers =>
    transfers.filter(transfers => transfers.state === TransferState.IN_PROGRESS)
);

export const Total: React.FC = () => {
  const { t } = useTranslation();
  const transfers = useSelector(activeTransfersSelector);

  if (transfers.length < 2) {
    return null;
  }

  const offsetSum = transfers.reduce(
    (sum, transfer) => sum + (transfer.offset || 0),
    0
  );
  const sizeSum = transfers.reduce(
    (sum, transfer) => sum + transfer.fileSize,
    0
  );

  const downloadSpeedSum = transfers.reduce(
    (sum, transfer) => sum + (transfer.receiving ? transfer.speed || 0 : 0),
    0
  );
  const uploadSpeedSum = transfers.reduce(
    (sum, transfer) => sum + (!transfer.receiving ? transfer.speed || 0 : 0),
    0
  );

  const formattedOffset = offsetSum && formatFileSize(offsetSum);
  const formattedSize = formatFileSize(sizeSum);

  return (
    <li className={styles.total}>
      <div>
        <span>
          {formattedOffset
            ? t('transfers.progress', {
                offset: formattedOffset,
                size: formattedSize,
              })
            : formattedSize}
        </span>
        <span>({transfers.length})</span>
      </div>
      <div>
        <span>
          <IoArrowDown /> {formatFileSize(downloadSpeedSum)}/s
        </span>
        <span>
          <IoArrowUp /> {formatFileSize(uploadSpeedSum)}/s
        </span>
      </div>
    </li>
  );
};
