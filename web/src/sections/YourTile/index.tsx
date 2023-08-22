import React from 'react';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';

import styles from './index.module.scss';
import { TargetTile } from '../../components/TargetTile.js';
import { ClientName } from './ClientName.js';
import { networkStore } from '../../stores/index.js';

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
        </div>
      </div>
    </div>
  );
});
