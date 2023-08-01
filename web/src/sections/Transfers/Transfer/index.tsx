import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './index.module.scss';
import { animationPropsSlide } from '../../../animationSettings';
import { TransferModel } from '../../../types/Models';
import { TransferState } from '../../../types/TransferState';
import { motion } from '../../../animate';
import { formatFileName, formatFileSize } from '../../../utils/file';
import { humanTimeLeft } from '../../../utils/time';
import { Tooltip } from '../../../components/Tooltip';
import { TransferIcon } from './TransferIcon';
import { TransferTarget } from './TransferTarget';
import { TransferActions, cancellableStates } from './TransferActions';

export { cancellableStates };

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
            <span>{formatFileName(transfer.fileName)}</span>
          </Tooltip>
        </div>
        {transfer.state === TransferState.IN_PROGRESS ? (
          <progress
            value={(transfer.offset || 0) / transfer.fileSize}
            max={1}
          />
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
      <TransferActions transfer={transfer} />
    </motion.li>
  );
};
