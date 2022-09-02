import React from 'react';
import { useSelector } from 'react-redux';
import { ScrollArea } from 'react-nano-scrollbar';
import { AnimatePresence } from 'framer-motion';

import { animationPropsOpacity } from '../animationSettings';
import { StateType } from '../reducers';
import NetworkTile from './NetworkTile';
import Animate from './Animate';

interface NetworkProps {
  onSelect?: (clientId: string) => void;
}

const Network: React.FC<NetworkProps> = ({ onSelect }) => {
  const network = useSelector((store: StateType) =>
    store.network.filter(client => client.clientId !== store.clientId)
  );

  return (
    <ScrollArea
      horizontal
      hideScrollbarY
      className={onSelect ? 'network-select' : 'subsection'}
    >
      <AnimatePresence>
        {network.length > 0 ? (
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
        ) : (
          <Animate component="span" {...animationPropsOpacity}>
            <div>Nobody is connected to your network.</div>
            <div>Open this website elsewhere to connect.</div>
          </Animate>
        )}
      </AnimatePresence>
    </ScrollArea>
  );
};

export default Network;
