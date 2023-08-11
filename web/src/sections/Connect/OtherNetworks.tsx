import React from 'react';
import { useTranslation } from 'react-i18not';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import styles from './OtherNetworks.module.scss';
import { Button } from '../../components/Button.js';
import { networkStore } from '../../stores/index.js';

export const OtherNetworks: React.FC = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const names = networkStore.otherNetworks;
  if (!names?.length) {
    return null;
  }

  return (
    <div>
      <div className={styles.header}>{t('otherNetworks')}</div>
      <div className={styles.list}>
        {names.map(name => (
          <Button key={name} onClick={() => navigate(`/${name}`)}>
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
});
