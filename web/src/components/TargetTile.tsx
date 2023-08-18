import React from 'react';
import clsx from 'clsx';
import {
  IoLockClosed,
  IoPhonePortrait,
  IoHome,
  IoEllipsisHorizontal,
} from 'react-icons/io5/index.js';
import { ClientModel, DeviceType } from '@filedrop/types';
import { observer } from 'mobx-react-lite';

import styles from './TargetTile.module.scss';
import { uuidToColor } from '../utils/color.js';
import { connection } from '../stores/index.js';

interface TargetTileProps extends React.HTMLProps<HTMLDivElement> {
  client: ClientModel;
  variant?: 'small' | 'big';
}

export const TargetTile = observer(
  React.forwardRef<HTMLDivElement, React.PropsWithChildren<TargetTileProps>>(
    ({ client, className, variant = 'small', children, ...props }, ref) => {
      const isSecure = connection.secure && !!client.publicKey;
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
            <div className={styles.icons}>
              {isSecure && <IoLockClosed className={styles.secure} />}
              {isLocal && <IoHome className={styles.local} />}
              {isMobile && <IoPhonePortrait className={styles.device} />}
            </div>
          )}
          {children}
        </div>
      );
    }
  )
);
