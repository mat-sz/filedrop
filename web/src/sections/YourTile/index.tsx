import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import styles from './index.module.scss';
import { StateType } from '../../reducers';
import { TargetTile } from '../../components/TargetTile';
import { ClientName } from './ClientName';

export const YourTileSection: React.FC = () => {
  const { t } = useTranslation();
  const client = useSelector((store: StateType) =>
    store.network?.find(client => client.clientId === store.clientId)
  );

  return (
    <div className={clsx('subsection', styles.you)}>
      {client && (
        <TargetTile variant="big" client={client}>
          {t('you')}
        </TargetTile>
      )}
      <div className={styles.info}>
        <ClientName />
        <div>
          <strong>{t('yourTile.title')}</strong> {t('yourTile.body')}
        </div>
      </div>
    </div>
  );
};
