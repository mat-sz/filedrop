import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { StateType } from '../reducers';
import { nameCharacterSet, nameLength } from '../config';

const Home: React.FC = () => {
  const networkName = useSelector((state: StateType) => state.networkName);
  const connected = useSelector((state: StateType) => state.connected);
  const clientId = useSelector((state: StateType) => state.clientId);
  const suggestedName = useSelector((state: StateType) => state.suggestedName);

  const navigate = useNavigate();

  useEffect(() => {
    const currentNetworkName =
      networkName ||
      suggestedName ||
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
  }, [connected, networkName, navigate, clientId, suggestedName]);

  return <section className="center">Loading...</section>;
};

export default Home;
