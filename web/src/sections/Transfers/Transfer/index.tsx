import React from 'react';
import { useTranslation } from 'react-i18not';
import { motion } from 'nanoanim';

import styles from './index.module.scss';
import { animationPropsSlide } from '../../../animationSettings';
import { TransferModel } from '../../../types/Models';
import { TransferState } from '../../../types/TransferState';
import { formatFileName, formatFileSize } from '../../../utils/file';
import { humanTimeElapsed, humanTimeLeft } from '../../../utils/time';
import { Tooltip } from '../../../components/Tooltip';
import { TransferIcon } from './TransferIcon';
import { TransferTarget } from './TransferTarget';
import { TransferActions } from './TransferActions';

interface TransferProps {
  transfer: TransferModel;
}

export const Transfer: React.FC<TransferProps> = ({ transfer }) => {
  const { t } = useTranslation();

  const formattedOffset = transfer.offset && formatFileSize(transfer.offset);
  const formattedSize = formatFileSize(transfer.fileSize);

  return (
    <motion.li
      className={styles.transfer}
      {...animationPropsSlide}
      aria-label="Transfer"
    >
      <TransferIcon transfer={transfer} />
      <div className={styles.state}>
        <div className={styles.filename}>
          <TransferTarget transfer={transfer} />
          <Tooltip content={transfer.fileName}>
            <span className="mobileHidden">
              {formatFileName(transfer.fileName)}
            </span>
            <span className="desktopHidden">
              {formatFileName(transfer.fileName, 8)}
            </span>
          </Tooltip>
        </div>
        {transfer.state === TransferState.IN_PROGRESS ? (
          <progress
            value={(transfer.offset || 0) / transfer.fileSize}
            max={1}
          />
        ) : null}
        <div className={styles.metadata}>
          <span>
            {formattedOffset
              ? t('transfers.progress', {
                  offset: formattedOffset,
                  size: formattedSize,
                })
              : formattedSize}
          </span>
          {transfer.state === TransferState.FAILED && <span>Failed!</span>}
          <span>{humanTimeElapsed(transfer.time)}</span>
          {transfer.state === TransferState.IN_PROGRESS && (
            <>
              <span>{formatFileSize(transfer.speed!)}/s</span>
              <span>{humanTimeLeft(transfer.timeLeft)}</span>
            </>
          )}
        </div>
      </div>
      <TransferActions transfer={transfer} />
    </motion.li>
  );
};
