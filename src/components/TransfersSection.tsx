import React from 'react';
import { useSelector } from 'react-redux';

import { StateType } from '../reducers';
import TransferList from './TransferList';
import Network from './Network';

const TransfersSection: React.FC = () => {
  const clientColor = useSelector((store: StateType) => store.clientColor);

  return (
    <div>
      <h2>Your network</h2>
      <div className="subsection info-grid">
        <div className="image">
          <div
            className="network-tile"
            style={{
              backgroundColor: clientColor,
            }}
          >
            You
          </div>
        </div>
        <div className="info">
          <div>
            <strong>This is your tile.</strong>
          </div>
          <div>
            Under this section you will see other tiles like this one. Drag and
            drop your files or click on them to initiate a file transfer.
          </div>
        </div>
      </div>
      <Network />
      <TransferList />
    </div>
  );
};

export default TransfersSection;
