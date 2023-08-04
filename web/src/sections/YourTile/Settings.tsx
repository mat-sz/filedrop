import React from 'react';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';

import styles from './Settings.module.scss';
import { Toggle } from '../../components/Toggle';
import { applicationStore } from '../../stores/ApplicationStore';

export const Settings: React.FC = observer(() => {
  const { t } = useTranslation();

  return (
    <div className={styles.settings}>
      <Toggle
        label={t('settings.autoAccept')}
        value={applicationStore.autoAccept}
        onChange={value =>
          runInAction(() => (applicationStore.autoAccept = value))
        }
      />
    </div>
  );
});
