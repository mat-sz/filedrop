import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Loading } from '../components/Loading';
import { StateType } from '../reducers';
import { nameCharacterSet, nameLength } from '../config';
import { randomString } from '../utils/string';

export const Home: React.FC = () => {
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
      randomString(nameLength, nameCharacterSet);
    if (connected && clientId) {
      navigate('/' + currentNetworkName);
    }
  }, [connected, networkName, navigate, clientId, suggestedNetworkName]);

  return <Loading>{t('state.loading')}</Loading>;
};
