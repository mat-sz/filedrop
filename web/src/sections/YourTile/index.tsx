import React from 'react';
import { useTranslation } from 'react-i18not';

import styles from './index.module.scss';
import { TargetTile } from '../../components/TargetTile';
import { ClientName } from './ClientName';
import { Settings } from './Settings';
import { observer } from 'mobx-react-lite';
import { networkStore } from '../../stores';

export const YourTileSection: React.FC = observer(() => {
  const { t } = useTranslation();
  const client = networkStore.currentClient;

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
