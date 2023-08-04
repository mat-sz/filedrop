import React from 'react';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18not';
import { motion } from 'nanoanim';
import { IoAdd } from 'react-icons/io5';
import { ClientModel } from '@filedrop/types';

import styles from './NetworkTile.module.scss';
import { animationPropsOpacity } from '../animationSettings';
import { TargetTile } from './TargetTile';
import { applicationStore } from '../stores/ApplicationStore';

interface NetworkTileProps {
  client: ClientModel;
  onSelect?: (clientId: string) => void;
}

export const NetworkTile: React.FC<NetworkTileProps> = ({
  client,
  onSelect,
}) => {
  const { t } = useTranslation();

  const onDrop = (files: File[]) => {
    for (const file of files) {
      applicationStore.networkStore.createTransfer(file, client.clientId);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const preventClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const onClick = () => {
    onSelect?.(client.clientId);
  };

  const dragProps = onSelect ? {} : getRootProps();

  return (
    <motion.div
      {...animationPropsOpacity}
      onClick={onClick}
      className={styles.wrapper}
    >
      <TargetTile
        {...dragProps}
        client={client}
        variant="big"
        className={clsx(styles.tile, { active: isDragActive })}
      >
        {!onSelect && (
          <label onClick={preventClick}>
            <input
              {...getInputProps({
                style: {},
              })}
              accept={'*'}
              tabIndex={1}
            />
            {t('tile')}
          </label>
        )}
        <IoAdd className={styles.plus} />
      </TargetTile>
      <div className={styles.name}>{client.clientName}</div>
    </motion.div>
  );
};
