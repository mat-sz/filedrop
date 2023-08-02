import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18not';
import { IoPencil, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

import styles from './ClientName.module.scss';
import { setClientNameAction } from '../../actions/state';
import { StateType } from '../../reducers';
import { IconButton } from '../../components/IconButton';

export const ClientName: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const clientName = useSelector((store: StateType) => store.clientName);

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
      dispatch(setClientNameAction(name));
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
};
