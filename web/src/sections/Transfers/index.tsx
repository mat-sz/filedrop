import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18not';
import { AnimatePresence } from 'nanoanim';

import styles from './index.module.scss';
import { StateType } from '../../reducers';
import { Transfer } from './Transfer';
import { Actions } from './Actions';
import { Total } from './Total';

export const TransfersSection: React.FC = () => {
  const { t } = useTranslation();
  const transfers = useSelector((store: StateType) => store.transfers);

  return (
    <>
      {transfers.length > 0 && (
        <div className="subsection">
          <div className={styles.header}>
            <h2>{t('transfers.title')}</h2>
            <Actions />
          </div>
          <ul className={styles.queue}>
            <Total />
            <AnimatePresence>
              {transfers.map(transfer => (
                <Transfer key={transfer.transferId} transfer={transfer} />
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </>
  );
};
