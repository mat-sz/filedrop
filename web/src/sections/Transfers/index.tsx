import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DeviceType } from '@filedrop/types';

import styles from './index.module.scss';
import { StateType } from '../../reducers';
import { Network } from '../../components/Network';
import { deviceType, isBrowserCompatible } from '../../utils/browser';
import { TransferList } from './TransferList';
import { ClientName } from './ClientName';
import { TargetTile } from '../../components/TargetTile';
import { IncompatibleBrowser } from '../../components/IncompatibleBrowser';

export const TransfersSection: React.FC = () => {
  const { t } = useTranslation();
  const client = useSelector((store: StateType) =>
    store.network?.find(client => client.clientId === store.clientId)
  );
  const noticeText = useSelector((store: StateType) => store.noticeText);
  const noticeUrl = useSelector((store: StateType) => store.noticeUrl);
  const publicKey = useSelector((state: StateType) => state.publicKey);

  if (!client) {
    return null;
  }

  return (
    <div>
      {!isBrowserCompatible ? <IncompatibleBrowser /> : null}
      {!!noticeText && (
        <div className={clsx('subsection', 'notice')}>
          {noticeUrl ? <a href={noticeUrl}>{noticeText}</a> : noticeText}
        </div>
      )}
      <div className={clsx('subsection', styles.grid)}>
        <div className={styles.image}>
          <TargetTile
            variant="big"
            client={client}
            secure={!!publicKey}
            mobile={deviceType === DeviceType.MOBILE}
          >
            {t('you')}
          </TargetTile>
        </div>
        <div className={styles.info}>
          <ClientName />
          <div>
            <strong>{t('yourTile.title')}</strong> {t('yourTile.body')}
          </div>
        </div>
      </div>
      <Network />
      <TransferList />
    </div>
  );
};
