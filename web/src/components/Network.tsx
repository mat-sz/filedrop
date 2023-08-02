import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { ScrollArea } from 'react-nano-scrollbar';
import { useTranslation } from 'react-i18not';
import { AnimatePresence, motion } from 'nanoanim';
import clsx from 'clsx';

import styles from './Network.module.scss';
import { setTabAction } from '../actions/state';
import { animationPropsOpacity } from '../animationSettings';
import { StateType } from '../reducers';
import { NetworkTile } from './NetworkTile';
import { Button } from './Button';

interface NetworkProps {
  onSelect?: (clientId: string) => void;
}

const networkSelector = createSelector(
  [(state: StateType) => state.network, (state: StateType) => state.clientId],
  (network, clientId) => network.filter(client => client.clientId !== clientId)
);

export const Network: React.FC<NetworkProps> = ({ onSelect }) => {
  const { t } = useTranslation();
  const network = useSelector(networkSelector);
  const dispatch = useDispatch();

  return (
    <AnimatePresence>
      {network.length > 0 ? (
        <ScrollArea horizontal hideScrollbarY>
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
        <motion.div className={clsx(styles.empty)} {...animationPropsOpacity}>
          <div>{t('emptyNetwork.title')}</div>
          <div>{t('emptyNetwork.body')}</div>
          <div>
            <Button
              className="desktopHidden"
              onClick={() => dispatch(setTabAction('connect'))}
            >
              {t('emptyNetwork.qr')}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
