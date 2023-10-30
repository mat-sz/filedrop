import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';

import { Loading } from '../components/Loading.js';
import { nameCharacterSet, nameLength } from '../config.js';
import { randomString } from '../utils/string.js';
import { applicationStore, connection, networkStore } from '../stores/index.js';

export const Redirect: React.FC = observer(() => {
  const { t } = useTranslation();
  const { networkName } = networkStore;
  const suggestedNetworkName = applicationStore.suggestedNetworkName;
  const { connected, clientId } = connection;

  const navigate = useLocation()[1];

  useEffect(() => {
    const currentNetworkName =
      networkName ||
      suggestedNetworkName ||
      randomString(nameLength, nameCharacterSet);

    if (connected && clientId) {
      navigate('/' + currentNetworkName + window.location.hash, {
        replace: true,
      });
    }
  }, [connected, networkName, navigate, clientId, suggestedNetworkName]);

  return <Loading>{t('state.loading')}</Loading>;
});
