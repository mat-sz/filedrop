import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.scss';
import { StateType } from '../../reducers';

export const OtherNetworksSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const localNetworkNames = useSelector((store: StateType) =>
    store.localNetworkNames.filter(name => name !== store.networkName)
  );

  if (localNetworkNames.length === 0) {
    return null;
  }

  return (
    <div className="subsection">
      <h2>{t('otherNetworks')}</h2>
      <div className={styles.list}>
        {localNetworkNames.map(name => (
          <button key={name} onClick={() => navigate(`/${name}`)}>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};
