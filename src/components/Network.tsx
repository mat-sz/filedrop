import React from 'react';
import { useSelector } from 'react-redux';
import { ScrollArea } from 'react-nano-scrollbar';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from '../animate';

import { animationPropsOpacity } from '../animationSettings';
import { StateType } from '../reducers';
import NetworkTile from './NetworkTile';

interface NetworkProps {
  onSelect?: (clientId: string) => void;
}

const Network: React.FC<NetworkProps> = ({ onSelect }) => {
  const { t } = useTranslation();
  const network = useSelector((store: StateType) =>
    store.network.filter(client => client.clientId !== store.clientId)
  );
  const className = onSelect ? 'network-select' : 'subsection';

  return (
    <AnimatePresence>
      {network.length > 0 ? (
        <ScrollArea horizontal hideScrollbarY className={className}>
          <div className="network">
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
          className={`${className} center`}
          {...animationPropsOpacity}
        >
          <div>{t('emptyNetwork.title')}</div>
          <div>{t('emptyNetwork.body')}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Network;
