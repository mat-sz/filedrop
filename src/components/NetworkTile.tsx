import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

import { ClientModel } from '../types/Models';
import { createTransferAction } from '../actions/transfers';
import { animationPropsRotation } from '../animationSettings';

interface NetworkTileProps {
    client: ClientModel,
    onSelect?: (clientId: string) => void,
};

const NetworkTile: React.FC<NetworkTileProps> = ({ client, onSelect }) => {
    const dispatch = useDispatch();

    const onDrop = useCallback((files: File[]) => {
        for (let file of files) {
            dispatch(createTransferAction(file, client.clientId));
        }
    }, [ dispatch, client.clientId ]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop
    });

    const preventClick = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    const onClick = useCallback(() => {
        onSelect(client.clientId);
    }, [ client, onSelect ]);

    return (
        <motion.div {...animationPropsRotation} onClick={onSelect ? onClick : null}>
            { onSelect ?
            <div className="network-tile"
                style={{
                    backgroundColor: client.clientColor
                }}
            >
            </div>
            :
            <div {...getRootProps()} className={"network-tile " + (isDragActive ? 'active' : '')}
                style={{
                    backgroundColor: client.clientColor
                }}
            >
                <label onClick={preventClick}>
                    <input {...getInputProps({
                        style: {}
                    })} accept={'*'} tabIndex={1} />
                </label>
            </div>
            }
        </motion.div>
    );
}

export default NetworkTile;
