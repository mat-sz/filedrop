import React from 'react';
import { useSelector } from 'react-redux';
import { FaFile, FaFileAlt, FaFileVideo, FaFileAudio, FaFileImage, FaTimes, FaArrowDown, FaArrowUp, FaAngleDoubleDown, FaCheck, FaAngleDoubleUp, FaHourglassHalf, FaHourglassEnd } from 'react-icons/fa';

import { TransferModel } from '../types/Models';
import { StateType } from '../reducers';
import { TransferState } from '../types/TransferState';

const TransferIcon: React.FC<{
    transfer: TransferModel,
}> = ({ transfer }) => {
    const network = useSelector((state: StateType) => state.network);
    const targetClient = network.find((client) => client.clientId === transfer.clientId);

    const typeIcon = (type: string) => {
        if (type.startsWith('text/')) {
            return <FaFileAlt />;
        } else if (type.startsWith('image/')) {
            return <FaFileImage />;
        } else if (type.startsWith('video/')) {
            return <FaFileVideo />;
        } else if (type.startsWith('audio/')) {
            return <FaFileAudio />;
        } else if (type.startsWith('application/')) {
            return <FaFileAlt />;
        } else {
            return <FaFile />;
        }
    };

    const stateIcon = (state: TransferState, receiving: boolean) => {
        switch (state) {
            case TransferState.INCOMING:
                return <FaArrowDown />;
            case TransferState.OUTGOING:
                return <FaArrowUp />;
            case TransferState.FAILED:
                return <FaTimes />;
            case TransferState.IN_PROGRESS:
                if (receiving) {
                    return <FaAngleDoubleDown />;
                } else {
                    return <FaAngleDoubleUp />;
                }
            case TransferState.CONNECTING:
                return <FaHourglassHalf />;
            case TransferState.CONNECTED:
                return <FaHourglassEnd />;
            case TransferState.COMPLETE:
                return <FaCheck />;
        }
        
        return null;
    };

    return (
        <>
            <div className="transfer-icon">
                { targetClient ? 
                <div className="network-tile target-tile"
                    style={{
                        backgroundColor: targetClient.clientColor
                    }}
                >
                    { stateIcon(transfer.state, transfer.receiving) }
                </div>
                : null }
                { typeIcon(transfer.fileType) }
            </div>
        </>
    );
}

export default TransferIcon;
