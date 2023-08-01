import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.scss';
import { StateType } from '../../reducers';
import { Button } from '../../components/Button';

const namesSelector = createSelector(
  [
    (state: StateType) => state.localNetworkNames,
    (state: StateType) => state.networkName,
  ],
  (names, networkName) => names.filter(name => name !== networkName)
);

export const OtherNetworksSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const localNetworkNames = useSelector(namesSelector);

  if (localNetworkNames.length === 0) {
    return null;
  }

  return (
    <div className="subsection">
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
