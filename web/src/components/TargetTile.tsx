import React from 'react';
import clsx from 'clsx';
import { FaLock, FaMobile, FaNetworkWired } from 'react-icons/fa';
import { ClientModel } from '@filedrop/types';

import styles from './TargetTile.module.scss';
import { uuidToColor } from '../utils/color';

interface TargetTileProps extends React.HTMLProps<HTMLDivElement> {
  client: ClientModel;
  variant?: 'small' | 'big';
  secure?: boolean;
  local?: boolean;
  mobile?: boolean;
}

export const TargetTile: React.FC<React.PropsWithChildren<TargetTileProps>> = ({
  client,
  className,
  variant = 'small',
  secure,
  local,
  mobile,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(styles.tile, styles[variant], className)}
      style={{
        backgroundColor: uuidToColor(client.clientId),
      }}
      {...props}
    >
      {secure && (
        <div className={styles.secure}>
          <FaLock />
        </div>
      )}
      {local && (
        <div className={styles.local}>
          <FaNetworkWired />
        </div>
      )}
      {mobile && (
        <div className={styles.device}>
          <FaMobile />
        </div>
      )}
      {children}
    </div>
  );
};
