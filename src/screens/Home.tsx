import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { StateType } from '../reducers';
import { nameCharacterSet, nameLength } from '../config';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const networkName = useSelector((state: StateType) => state.networkName);
  const connected = useSelector((state: StateType) => state.connected);
  const clientId = useSelector((state: StateType) => state.clientId);
  const suggestedNetworkName = useSelector(
    (state: StateType) => state.suggestedNetworkName
  );

  const navigate = useNavigate();

  useEffect(() => {
    const currentNetworkName =
      networkName ||
      suggestedNetworkName ||
      new Array(nameLength)
        .fill('')
        .map(() =>
          nameCharacterSet.charAt(
            Math.floor(Math.random() * nameCharacterSet.length)
          )
        )
        .join('');
    if (connected && clientId) {
      navigate('/' + currentNetworkName);
    }
  }, [connected, networkName, navigate, clientId, suggestedNetworkName]);

  return <section className="center">{t('state.loading')}</section>;
};

export default Home;
