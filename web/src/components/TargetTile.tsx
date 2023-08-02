import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { IoLockClosed, IoPhoneLandscape, IoHome } from 'react-icons/io5';
import { ClientModel, DeviceType } from '@filedrop/types';

import styles from './TargetTile.module.scss';
import { uuidToColor } from '../utils/color';
import { StateType } from '../reducers';

interface TargetTileProps extends React.HTMLProps<HTMLDivElement> {
  client: ClientModel;
  variant?: 'small' | 'big';
}

export const TargetTile = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<TargetTileProps>
>(({ client, className, variant = 'small', children, ...props }, ref) => {
  const publicKey = useSelector((state: StateType) => state.publicKey);

  const isSecure = !!publicKey && !!client.publicKey;
  const isLocal = client.isLocal;
  const isMobile = client.deviceType === DeviceType.MOBILE;

  return (
    <div
      className={clsx(styles.tile, styles[variant], className)}
      style={{
        backgroundColor: uuidToColor(client.clientId),
      }}
      ref={ref}
      {...props}
    >
      {variant === 'big' && (
        <>
          {isSecure && <IoLockClosed className={styles.secure} />}
          {isLocal && <IoHome className={styles.local} />}
          {isMobile && <IoPhoneLandscape className={styles.device} />}
        </>
      )}
      {children}
    </div>
  );
});
