import React from 'react';
import { useSelector } from 'react-redux';

import { StateType } from '../reducers';
import TransferList from './TransferList';
import NetworkTile from './NetworkTile';

const TransfersSection: React.FC = () => {
    const clientColor = useSelector((store: StateType) => store.clientColor);
    const network = useSelector((store: StateType) => store.network);
    const activeTransfers = useSelector((store: StateType) => store.activeTransfers);
    const incomingTransfers = useSelector((store: StateType) => store.incomingTransfers);
    const outgoingTransfers = useSelector((store: StateType) => store.outgoingTransfers);

    return (
        <div>
            <h2>Create a new transfer:</h2>
            <div className="subsection network-you">
                <div className="network-tile" style={{
                    backgroundColor: clientColor
                }}>You</div>
                <div className="help">
                    <div>This is your tile.</div>
                    <div>Drag and drop files onto other tiles or click on a tile to start a transfer.</div>
                </div>
            </div>
            { network.length > 0 ?
            <div className="subsection network">
                { network.map((client) => <NetworkTile key={client.clientId} client={client} />) }
            </div>
            :
            <div className="subsection">
                Nobody is connected to your network.
            </div>
            }
            <TransferList transfers={activeTransfers} type={'active'} />
            <TransferList transfers={incomingTransfers} type={'incoming'} />
            <TransferList transfers={outgoingTransfers} type={'outgoing'} />
        </div>
    );
}

export default TransfersSection;
