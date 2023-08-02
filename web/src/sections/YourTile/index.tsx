import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18not';

import styles from './index.module.scss';
import { StateType } from '../../reducers';
import { TargetTile } from '../../components/TargetTile';
import { ClientName } from './ClientName';
import { Settings } from './Settings';

export const YourTileSection: React.FC = () => {
  const { t } = useTranslation();
  const client = useSelector((store: StateType) =>
    store.network?.find(client => client.clientId === store.clientId)
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
};
