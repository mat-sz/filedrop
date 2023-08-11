import React from 'react';
import { ScrollArea } from 'react-nano-scrollbar';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'nanoanim';
import clsx from 'clsx';

import styles from './Network.module.scss';
import { animationPropsOpacity } from '../animationSettings';
import { NetworkTile } from './NetworkTile';
import { Button } from './Button';
import { applicationStore, networkStore } from '../stores';

interface NetworkProps {
  onSelect?: (clientId: string) => void;
}

export const Network: React.FC<NetworkProps> = observer(({ onSelect }) => {
  const { t } = useTranslation();
  const clients = networkStore.clients;

  return (
    <AnimatePresence>
      {clients.length > 0 ? (
        <ScrollArea horizontal hideScrollbarY>
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
        </ScrollArea>
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
