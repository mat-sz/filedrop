import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';

import { Loading } from '../components/Loading';
import { nameCharacterSet, nameLength } from '../config';
import { randomString } from '../utils/string';
import { applicationStore } from '../stores/ApplicationStore';

export const Redirect: React.FC = observer(() => {
  const { t } = useTranslation();
  const { networkName, clientId } = applicationStore.networkStore;
  const { connected, suggestedNetworkName } = applicationStore;

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
});
