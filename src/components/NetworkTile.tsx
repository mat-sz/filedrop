import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Dropzone from 'react-dropzone';

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

    return (
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
    );
}

export default NetworkTile;
