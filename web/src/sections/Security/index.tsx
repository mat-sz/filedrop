import React from 'react';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';
import { IoCheckmark, IoWarning } from 'react-icons/io5/index.js';
import clsx from 'clsx';

import styles from './index.module.scss';
import { connection } from '../../stores/index.js';

export const SecuritySection: React.FC = observer(() => {
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
        <>
          <div>
            <IoCheckmark />
          </div>
          {t('secure')}
        </>
      ) : (
        <>
          <div>
            <IoWarning />
          </div>
          {t('insecure')}
        </>
      )}
    </div>
  );
});
