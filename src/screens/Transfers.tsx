import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import QrCode from 'qrcode.react';
import Dropzone from 'react-dropzone';

import { StateType } from '../reducers';
import { ActionType } from '../types/ActionType';

const Transfers: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const [ href, setHref ] = useState('');
    const dispatch = useDispatch();

    const outgoingTransfers = useSelector((store: StateType) => store.outgoingTransfers);

    useEffect(() => {
        setHref(window.location.href);
    }, [ setHref, code ])

    const onDrop = useCallback((files: File[]) => {
        for (let file of files) {
            dispatch({ type: ActionType.CREATE_TRANSFER, value: file });
        }
    }, [ dispatch ]);

    return (
        <div className="screen">
            <h2>Transfer files:</h2>
            <div>
                Scan this QR code:
                <QrCode value={ href } />
                or open this URL on another device:
                <pre>
                    { href }
                </pre>
            </div>
            <h2>Your transfers:</h2>
            <div>
                { outgoingTransfers.map((transfer) =>
                    <div>
                        { transfer.fileName }
                    </div>
                )}
            </div>
            <h2>Create a new transfer:</h2>
            <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} accept={'*'} />
                    <div>To send files, drag and drop them here</div>
                    <div>or click on this area to open a file selection dialog.</div>
                </div>
                )}
            </Dropzone>
        </div>
    );
}

export default Transfers;
