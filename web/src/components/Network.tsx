import React from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence } from 'nanoanim';

import styles from './Network.module.scss';
import { NetworkTile } from './NetworkTile.js';
import { networkStore } from '../stores/index.js';

interface NetworkProps {
  onSelect?: (clientId: string) => void;
  icon?: React.ReactNode;
}

export const Network: React.FC<NetworkProps> = observer(
  ({ onSelect, icon }) => {
    const clients = networkStore.clients;

    if (clients.length === 0) {
      return null;
    }

    return (
      <div className={styles.network}>
        <AnimatePresence>
          {clients.map(client => (
            <NetworkTile
              key={client.clientId}
              client={client}
              onSelect={onSelect}
              icon={icon}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  }
);
