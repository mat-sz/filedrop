import React from 'react';
import { useSelector } from 'react-redux';
import { ScrollArea } from 'react-nano-scrollbar';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { AnimatePresence, motion } from '../animate';
import styles from './Network.module.scss';
import { animationPropsOpacity } from '../animationSettings';
import { StateType } from '../reducers';
import { NetworkTile } from './NetworkTile';

interface NetworkProps {
  onSelect?: (clientId: string) => void;
}

export const Network: React.FC<NetworkProps> = ({ onSelect }) => {
  const { t } = useTranslation();
  const network = useSelector((store: StateType) =>
    store.network.filter(client => client.clientId !== store.clientId)
  );
  const className = onSelect ? styles.select : 'subsection';

  return (
    <AnimatePresence>
      {network.length > 0 ? (
        <ScrollArea horizontal hideScrollbarY className={className}>
          <div className={styles.network}>
            <AnimatePresence>
              {network.map(client => (
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
        <motion.div
          className={clsx(className, styles.empty)}
          {...animationPropsOpacity}
        >
          <div>{t('emptyNetwork.title')}</div>
          <div>{t('emptyNetwork.body')}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
