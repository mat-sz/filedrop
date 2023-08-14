import React from 'react';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';

import styles from './Settings.module.scss';
import { Toggle } from '../../components/Toggle.js';
import { settingsStore } from '../../stores/index.js';

export const Settings: React.FC = observer(() => {
  const { t } = useTranslation();
  const settings = settingsStore.settings as any;

  return (
    <div className={styles.settings}>
      {settingsStore.keys.map(key => (
        <Toggle
          key={key}
          label={t(`settings.${key}`)}
          value={settings[key]}
          onChange={value => runInAction(() => (settings[key] = value))}
        />
      ))}
    </div>
  );
});
