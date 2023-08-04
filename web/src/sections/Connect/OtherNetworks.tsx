import React from 'react';
import { useTranslation } from 'react-i18not';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import styles from './OtherNetworks.module.scss';
import { Button } from '../../components/Button';
import { applicationStore } from '../../stores/ApplicationStore';

export const OtherNetworks: React.FC = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const localNetworkNames = applicationStore.localNetworkNames?.filter(
    name => name !== applicationStore.networkStore.networkName
  );

  if (!localNetworkNames?.length) {
    return null;
  }

  return (
    <div>
      <div className={styles.header}>{t('otherNetworks')}</div>
      <div className={styles.list}>
        {localNetworkNames.map(name => (
          <Button key={name} onClick={() => navigate(`/${name}`)}>
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
});
