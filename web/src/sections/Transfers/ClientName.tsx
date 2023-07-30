import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

import { setClientNameAction } from '../../actions/state';
import { StateType } from '../../reducers';

const ClientName: React.FC = () => {
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
    <div className="client-name">
      {!isEditing ? (
        <>
          <strong>{clientName}</strong>{' '}
          <button className="icon-button" onClick={() => onEdit()}>
            <FaEdit />
          </button>
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
          <button onClick={() => onSave()} className="icon-button">
            <FaCheck />
          </button>
          <button onClick={() => onCancel()} className="icon-button">
            <FaTimes />
          </button>
        </>
      )}
    </div>
  );
};

export default ClientName;
