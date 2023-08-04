import React from 'react';
import { IoQrCode, IoChatbubbles, IoHome } from 'react-icons/io5';
import { observer } from 'mobx-react-lite';

import styles from './index.module.scss';
import { Tab } from './Tab';
import { applicationStore } from '../../stores/ApplicationStore';

export const MobileTabs: React.FC = observer(() => {
  const privateKey = applicationStore.privateKey;

  return (
    <div className={styles.tabs} role="tablist">
      <Tab id="transfers">
        <IoHome />
      </Tab>
      <Tab id="connect">
        <IoQrCode />
      </Tab>
      {!!privateKey && (
        <Tab id="chat">
          <IoChatbubbles />
        </Tab>
      )}
    </div>
  );
});
