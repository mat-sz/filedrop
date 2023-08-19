import React from 'react';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'nanoanim';
import clsx from 'clsx';

import styles from './Network.module.scss';
import { animationPropsOpacity } from '../animationSettings.js';
import { NetworkTile } from './NetworkTile.js';
import { Button } from './Button.js';
import { applicationStore, networkStore } from '../stores/index.js';

interface NetworkProps {
  onSelect?: (clientId: string) => void;
}

export const Network: React.FC<NetworkProps> = observer(({ onSelect }) => {
  const { t } = useTranslation();
  const clients = networkStore.clients;

  return (
    <AnimatePresence>
      {clients.length > 0 ? (
        <div className={styles.network}>
          <AnimatePresence>
            {clients.map(client => (
              <NetworkTile
                key={client.clientId}
                client={client}
                onSelect={onSelect}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div className={clsx(styles.empty)} {...animationPropsOpacity}>
          <div>{t('emptyNetwork.title')}</div>
          <div>{t('emptyNetwork.body')}</div>
          <div>
            <Button
              className="desktopHidden"
              onClick={() => applicationStore.setTab('connect')}
            >
              {t('emptyNetwork.qr')}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
