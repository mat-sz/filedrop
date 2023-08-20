import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18not';

import styles from './index.module.scss';
import { Network } from '../../components/Network.js';
import { applicationStore, networkStore } from '../../stores/index.js';
import { LocalNetworks } from '../LocalNetworks/index.js';
import clsx from 'clsx';
import { Button } from '../../components/Button.js';

export const NetworkSection: React.FC = observer(() => {
  const clients = networkStore.clients;
  const transfers = networkStore.transfers;
  const { t } = useTranslation();

  return (
    <>
      <div className="subsection">
        <Network />
        {clients.length === 0 && (
          <>
            <div className={styles.empty}>
              <div>
                <div>{t('emptyNetwork.title')}</div>
                {!!networkStore.otherNetworks?.length && (
                  <div>{t('emptyNetwork.local')}</div>
                )}
              </div>
              <div className="desktopHidden">
                <Button onClick={() => applicationStore.setTab('connect')}>
                  {t('emptyNetwork.qr')}
                </Button>
              </div>
            </div>
            <LocalNetworks />
          </>
        )}
      </div>
      {clients.length > 0 && transfers.size === 0 && (
        <div className={clsx('mobileHidden', styles.hint)}>
          {t('desktopHint')}
        </div>
      )}
    </>
  );
});
