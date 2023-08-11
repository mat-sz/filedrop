import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';

import styles from './Tab.module.scss';
import { applicationStore } from '../../stores';

interface Props {
  id: string;
}

export const Tab: React.FC<React.PropsWithChildren<Props>> = observer(
  ({ id, children }) => {
    const isActive = applicationStore.tab === id;

    return (
      <button
        className={clsx(styles.tab, { [styles.active]: isActive })}
        onClick={() => runInAction(() => (applicationStore.tab = id))}
        role="tab"
      >
        {children}
      </button>
    );
  }
);
