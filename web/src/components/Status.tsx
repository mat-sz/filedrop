import React from 'react';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import styles from './Status.module.scss';
import { connection } from '../stores/index.js';

export const Status: React.FC = observer(() => {
  const { t } = useTranslation();

  return !connection.connected && !connection.disconnectReason ? (
    <div className={clsx(styles.status, styles.error)}>
      <div>{t('state.connecting')}</div>
    </div>
  ) : null;
});
