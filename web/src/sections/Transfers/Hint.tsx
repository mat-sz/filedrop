import React from 'react';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';

import styles from './Hint.module.scss';
import { networkStore } from '../../stores/index.js';
import clsx from 'clsx';

export const Hint: React.FC = observer(() => {
  const { t } = useTranslation();

  return (
    <>
      {networkStore.transfers.size === 0 && (
        <div className={clsx('mobileHidden', styles.hint)}>
          {t('desktopHint')}
        </div>
      )}
    </>
  );
});
