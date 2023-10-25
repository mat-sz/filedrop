import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18not';
import { IoAdd } from 'react-icons/io5';
import { ClientModel } from '@filedrop/types';

import styles from './NetworkTile.module.scss';
import { TargetTile } from './TargetTile.js';
import { networkStore } from '../stores/index.js';

interface NetworkTileProps {
  client: ClientModel;
  onSelect?: (clientId: string) => void;
  icon?: React.ReactNode;
}

export const NetworkTile: React.FC<NetworkTileProps> = ({
  client,
  onSelect,
  icon,
}) => {
  const { t } = useTranslation();

  const onDrop = (files: File[]) => {
    for (const file of files) {
      networkStore.createTransfer(file, client.clientId);
    }
  };

  const onClick = () => {
    onSelect?.(client.clientId);
  };

  return (
    <div onClick={onClick} className={styles.wrapper}>
      <TargetTile client={client} variant="big" className={clsx(styles.tile)}>
        {!onSelect && (
          <input
            type="file"
            tabIndex={0}
            onChange={e => {
              if (e.target.files) {
                onDrop([...e.target.files]);
              }

              e.target.value = '';
            }}
            title={t('tile')}
            multiple
          />
        )}
        <div className={styles.icon}>
          {icon ? icon : <IoAdd className={styles.plus} />}
        </div>
      </TargetTile>
      <div className={styles.name}>{client.clientName}</div>
    </div>
  );
};
