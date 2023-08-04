import React from 'react';
import { useTranslation } from 'react-i18not';
import { IoArrowDown, IoArrowUp } from 'react-icons/io5';

import styles from './Total.module.scss';
import { formatFileSize } from '../../utils/file';
import { TransferModel } from '../../types/Models';

interface Props {
  transfers: TransferModel[];
}

export const Total: React.FC<Props> = ({ transfers }) => {
  const { t } = useTranslation();

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
