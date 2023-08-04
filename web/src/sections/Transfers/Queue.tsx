import React from 'react';
import { AnimatePresence } from 'nanoanim';

import styles from './Queue.module.scss';
import { Transfer } from './Transfer';
import { Actions } from './Actions';
import { Total } from './Total';
import { TransferModel } from '../../types/Models';

interface Props {
  transfers: TransferModel[];
  title: string;
}

export const Queue: React.FC<Props> = ({ transfers, title }) => {
  return (
    <>
      {transfers.length > 0 && (
        <div className="subsection">
          <div className={styles.header}>
            <h3>{title}</h3>
            <Actions transfers={transfers} />
          </div>
          <ul className={styles.queue}>
            <Total transfers={transfers} />
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
