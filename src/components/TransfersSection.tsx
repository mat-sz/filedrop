import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dropzone from 'react-dropzone';

import { StateType } from '../reducers';
import { ActionType } from '../types/ActionType';
import TransferList from './TransferList';

const TransfersSection: React.FC = () => {
    const dispatch = useDispatch();

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
            <TransferList transfers={activeTransfers} type={'active'} />
            <TransferList transfers={incomingTransfers} type={'incoming'} />
            <TransferList transfers={outgoingTransfers} type={'outgoing'} />
            <h2>Create a new transfer:</h2>
            <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="subsection dropzone">
                    <label onClick={preventClick}>
                        <input {...getInputProps()} accept={'*'} />
                        <div>To send files, drag and drop them here</div>
                        <div>or click on this area to open a file selection dialog.</div>
                    </label>
                </div>
                )}
            </Dropzone>
        </div>
    );
}

export default TransfersSection;
