import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { useTranslation } from 'react-i18not';

import styles from './Tab.module.scss';
import { applicationStore } from '../../stores/index.js';

interface Props {
  id: string;
}

export const Tab: React.FC<React.PropsWithChildren<Props>> = observer(
  ({ id, children }) => {
    const isActive = applicationStore.tab === id;
    const { t } = useTranslation();

    const title = t(`tabs.${id}`);

    return (
      <button
        className={clsx(styles.tab, { [styles.active]: isActive })}
        onClick={() => runInAction(() => (applicationStore.tab = id))}
        role="tab"
        title={title}
      >
        <span>{children}</span>
      </button>
    );
  }
);
