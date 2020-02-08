import React from 'react';
import { useSelector } from 'react-redux';
import { FaFile, FaFileAlt, FaFileVideo, FaFileAudio, FaFileImage } from 'react-icons/fa';

import { TransferModel } from '../types/Models';
import { StateType } from '../reducers';

const TransferIcon: React.FC<{
    transfer: TransferModel,
}> = ({ transfer }) => {
    const network = useSelector((state: StateType) => state.network);
    const targetClient = network.find((client) => client.clientId === transfer.clientId);

    const icon = (type: string) => {
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

    return (
        <>
            <div className="transfer-icon">
                { targetClient ? 
                <div className="network-tile target-tile"
                    style={{
                        backgroundColor: targetClient.clientColor
                    }}
                >
                </div>
                : null }
                { icon(transfer.fileType) }
            </div>
        </>
    );
}

export default TransferIcon;
