import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dropzone from 'react-dropzone';

import { StateType } from '../reducers';
import { ActionType } from '../types/ActionType';
import TransferList from './TransferList';
import NetworkTile from './NetworkTile';

const TransfersSection: React.FC = () => {
    const dispatch = useDispatch();

    const clientColor = useSelector((store: StateType) => store.clientColor);
    const network = useSelector((store: StateType) => store.network);
    const activeTransfers = useSelector((store: StateType) => store.activeTransfers);
    const incomingTransfers = useSelector((store: StateType) => store.incomingTransfers);
    const outgoingTransfers = useSelector((store: StateType) => store.outgoingTransfers);

    const onDrop = useCallback((files: File[]) => {
        for (let file of files) {
            dispatch({ type: ActionType.CREATE_TRANSFER, value: file });
        }
    }, [ dispatch ]);

    const preventClick = (event: React.MouseEvent) => {
        event.preventDefault();
    };

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
            <div className="subsection network">
                { network.map((client) => <NetworkTile key={client.clientId} client={client} />) }
            </div>
            <TransferList transfers={activeTransfers} type={'active'} />
            <TransferList transfers={incomingTransfers} type={'incoming'} />
            <TransferList transfers={outgoingTransfers} type={'outgoing'} />
        </div>
    );
}

export default TransfersSection;
