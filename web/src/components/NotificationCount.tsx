import React from 'react';
import { observer } from 'mobx-react-lite';

import styles from './NotificationCount.module.scss';

interface Props {
  count?: number;
}

export const NotificationCount: React.FC<Props> = observer(({ count }) => {
  if (!count) {
    return null;
  }

  return <div className={styles.count}>{count}</div>;
});
