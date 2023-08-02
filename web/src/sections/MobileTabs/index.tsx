import React from 'react';
import { IoQrCode, IoChatbubbles, IoHome } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import styles from './index.module.scss';
import { StateType } from '../../reducers';
import { Tab } from './Tab';

export const MobileTabs: React.FC = () => {
  const privateKey = useSelector((store: StateType) => store.privateKey);

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
};
