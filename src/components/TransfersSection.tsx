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
                <div className="network-tile" style={{
                    backgroundColor: clientColor
                }}>You</div>
                <div className="info">
                    <div>
                        <strong>This is your tile.</strong>
                    </div>
                    <div>
                        Below this section you will see other tiles. You can drag and drop your files onto a tile or click on it to initiate a file transfer.
                    </div>
                </div>
            </div>
            <Network />
            <TransferList />
        </div>
    );
}

export default TransfersSection;
