import React from 'react';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';
import { IoCheckmarkCircle, IoWarning } from 'react-icons/io5';
import clsx from 'clsx';

import styles from './SecureStatus.module.scss';
import { connection } from '../stores/index.js';
import { Tooltip } from './Tooltip.js';

export const SecureStatus: React.FC = observer(() => {
  const { t } = useTranslation();
  const alwaysSecure = connection.alwaysSecure;

  if (!connection.connected) {
    return null;
  }

  return (
    <div
      className={clsx(styles.secureStatus, {
        [styles.secure]: alwaysSecure,
        [styles.insecure]: !alwaysSecure,
      })}
    >
      {alwaysSecure ? (
        <Tooltip content={t('secure')} location="bottom">
          <IoCheckmarkCircle />
        </Tooltip>
      ) : (
        <Tooltip content={t('insecure')} location="bottom">
          <IoWarning />
        </Tooltip>
      )}
    </div>
  );
});
