import React from 'react';
import { IoQrCode, IoChatbubbles, IoHome } from 'react-icons/io5/index.js';
import { observer } from 'mobx-react-lite';

import styles from './index.module.scss';
import { Tab } from './Tab.js';
import { connection } from '../../stores/index.js';

export const MobileTabs: React.FC = observer(() => {
  return (
    <div className={styles.tabs} role="tablist">
      <Tab id="transfers">
        <IoHome />
      </Tab>
      <Tab id="connect">
        <IoQrCode />
      </Tab>
      {connection.secure && (
        <Tab id="chat">
          <IoChatbubbles />
        </Tab>
      )}
    </div>
  );
});
