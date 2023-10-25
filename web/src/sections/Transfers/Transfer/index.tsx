import React from 'react';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';

import styles from './index.module.scss';
import { TransferState } from '../../../types/TransferState.js';
import { formatFileName, formatFileSize } from '../../../utils/file.js';
import { humanTime } from '../../../utils/time.js';
import { Tooltip } from '../../../components/Tooltip.js';
import { TransferIcon } from './TransferIcon.js';
import { TransferTarget } from './TransferTarget.js';
import { TransferActions } from './TransferActions.js';
import { Transfer } from '../../../stores/Transfer.js';

interface TransferProps {
  transfer: Transfer;
}

export const TransferInfo: React.FC<TransferProps> = observer(
  ({ transfer }) => {
    const { t } = useTranslation();

    const inProgress = transfer.state === TransferState.IN_PROGRESS;
    const offset = inProgress ? transfer.offset || 0 : 0;
    const formattedOffset = offset && formatFileSize(offset);
    const formattedSize = formatFileSize(transfer.fileSize);

    const elapsed = humanTime(transfer.timeElapsed());
    const left = humanTime(transfer.timeLeft());

    return (
      <li className={styles.transfer}>
        <TransferIcon transfer={transfer} />
        <div className={styles.state}>
          <div className={styles.filename}>
            <TransferTarget transfer={transfer} />
            <Tooltip content={transfer.fileName}>
              <span className="mobileHidden">
                {formatFileName(transfer.fileName)}
              </span>
              <span className="desktopHidden">
                {formatFileName(transfer.fileName, 10)}
              </span>
            </Tooltip>
          </div>
          {offset ? (
            <progress value={offset / transfer.fileSize} max={1} />
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
            <span>{elapsed && t('transfers.elapsed', { time: elapsed })}</span>
            {inProgress && (
              <>
                <span>{formatFileSize(transfer.speed()!)}/s</span>
                <span>{left && t('transfers.left', { time: left })}</span>
              </>
            )}
          </div>
        </div>
        <TransferActions transfer={transfer} />
      </li>
    );
  }
);
