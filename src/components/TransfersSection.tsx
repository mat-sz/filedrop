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
            <div className="subsection network-you">
                <div className="network-tile" style={{
                    backgroundColor: clientColor
                }}>You</div>
                <div className="help">
                    <div>This is your tile.</div>
                    <div>Drag and drop files onto other tiles or click on a tile to start a transfer.</div>
                </div>
            </div>
            <Network />
            <TransferList />
        </div>
    );
}

export default TransfersSection;
