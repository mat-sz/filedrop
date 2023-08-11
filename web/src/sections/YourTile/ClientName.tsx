import React, { useState } from 'react';
import { useTranslation } from 'react-i18not';
import {
  IoPencil,
  IoCheckmarkCircle,
  IoCloseCircle,
} from 'react-icons/io5/index.js';
import { observer } from 'mobx-react-lite';

import styles from './ClientName.module.scss';
import { IconButton } from '../../components/IconButton.js';
import { networkStore } from '../../stores/index.js';

export const ClientName: React.FC = observer(() => {
  const { t } = useTranslation();
  const clientName = networkStore.clientName;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(clientName);

  if (!clientName) {
    return null;
  }

  const onEdit = () => {
    setName(clientName);
    setIsEditing(true);
  };

  const onSave = () => {
    setIsEditing(false);

    if (name) {
      networkStore.updateClientName(name);
    }
  };

  const onCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className={styles.clientName}>
      {!isEditing ? (
        <>
          <strong>{clientName}</strong>{' '}
          <IconButton onClick={onEdit}>
            <IoPencil />
          </IconButton>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder={t('yourName')}
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={32}
          />
          <IconButton onClick={onSave}>
            <IoCheckmarkCircle />
          </IconButton>
          <IconButton onClick={onCancel}>
            <IoCloseCircle />
          </IconButton>
        </>
      )}
    </div>
  );
});
