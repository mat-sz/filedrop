import React from 'react';
import { IoQrCode, IoChatbubbles, IoHome } from 'react-icons/io5';
import { observer } from 'mobx-react-lite';

import styles from './index.module.scss';
import { Tab } from './Tab';
import { connection } from '../../stores';

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
