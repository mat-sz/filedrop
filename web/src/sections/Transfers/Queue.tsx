import React from 'react';
import { AnimatePresence } from 'nanoanim';
import { observer } from 'mobx-react-lite';

import styles from './Queue.module.scss';
import { TransferInfo } from './Transfer';
import { Actions } from './Actions';
import { Total } from './Total';
import { Transfer } from '../../stores/Transfer';

interface Props {
  transfers: Transfer[];
  title: string;
  showTotal?: boolean;
}

export const Queue: React.FC<Props> = observer(
  ({ transfers, title, showTotal }) => {
    return (
      <>
        {transfers.length > 0 && (
          <div className="subsection">
            <div className={styles.header}>
              <h3>{title}</h3>
              <Actions transfers={transfers} />
            </div>
            <ul className={styles.queue}>
              {showTotal && <Total transfers={transfers} />}
              <AnimatePresence>
                {transfers.map(transfer => (
                  <TransferInfo key={transfer.transferId} transfer={transfer} />
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </>
    );
  }
);
