import React from 'react';
import { useTranslation } from 'react-i18not';

import styles from './index.module.scss';
import { TargetTile } from '../../components/TargetTile';
import { ClientName } from './ClientName';
import { Settings } from './Settings';
import { observer } from 'mobx-react-lite';
import { applicationStore } from '../../stores/ApplicationStore';

export const YourTileSection: React.FC = observer(() => {
  const { t } = useTranslation();
  const client = applicationStore.networkStore.network.find(
    client => client.clientId === applicationStore.networkStore.clientId
  );

  return (
    <div className="subsection">
      <div className={styles.you}>
        {client && (
          <TargetTile variant="big" client={client}>
            {t('you')}
          </TargetTile>
        )}
        <div className={styles.info}>
          <ClientName />
          <Settings />
        </div>
      </div>
    </div>
  );
});
