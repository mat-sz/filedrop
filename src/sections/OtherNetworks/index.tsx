import React from 'react';
import { useSelector } from 'react-redux';

import { StateType } from '../../reducers';
import { useNavigate } from 'react-router-dom';

const OtherNetworksSection: React.FC = () => {
  const navigate = useNavigate();
  const localNetworkNames = useSelector((store: StateType) =>
    store.localNetworkNames.filter(name => name !== store.networkName)
  );

  if (localNetworkNames.length === 0) {
    return null;
  }

  return (
    <>
      <h2>Other local networks</h2>
      <div className="subsection">
        <div className="actions">
          {localNetworkNames.map(name => (
            <button key={name} onClick={() => navigate(`/${name}`)}>
              {name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default OtherNetworksSection;
