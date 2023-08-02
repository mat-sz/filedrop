import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useTranslation } from 'react-i18not';
import { useNavigate } from 'react-router-dom';

import styles from './OtherNetworks.module.scss';
import { StateType } from '../../reducers';
import { Button } from '../../components/Button';

const namesSelector = createSelector(
  [
    (state: StateType) => state.localNetworkNames,
    (state: StateType) => state.networkName,
  ],
  (names, networkName) => names.filter(name => name !== networkName)
);

export const OtherNetworks: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const localNetworkNames = useSelector(namesSelector);

  if (localNetworkNames.length === 0) {
    return null;
  }

  return (
    <div>
      <div className={styles.header}>{t('otherNetworks')}</div>
      <div className={styles.list}>
        {localNetworkNames.map(name => (
          <Button key={name} onClick={() => navigate(`/${name}`)}>
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
};
