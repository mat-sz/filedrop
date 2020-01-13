import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Dropzone from 'react-dropzone';
import { motion } from 'framer-motion';

import { ActionType } from '../types/ActionType';
import { ClientModel } from '../types/Models';

const NetworkTile: React.FC<{ client: ClientModel }> = ({ client }) => {
    const dispatch = useDispatch();

    const onDrop = useCallback((files: File[]) => {
        for (let file of files) {
            dispatch({ type: ActionType.CREATE_TRANSFER, value: {
                file: file,
                clientId: client.clientId,
            } });
        }
    }, [ dispatch, client.clientId ]);

    const preventClick = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    const animationProps = {
        initial: { scale: 0 },
        animate: { rotate: 180, scale: 1 },
        exit: { scale: 0 },
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
        },
        positionTransition: true,
    };

    return (
        <motion.div {...animationProps}>
            <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="network-tile"
                    style={{
                        backgroundColor: client.clientColor
                    }}>
                    <label onClick={preventClick}>
                        <input {...getInputProps()} accept={'*'} />
                    </label>
                </div>
                )}
            </Dropzone>
        </motion.div>
    );
}

export default NetworkTile;
