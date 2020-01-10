import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import QrCode from 'qrcode.react';
import Dropzone from 'react-dropzone';

import { StateType } from '../reducers';
import { ActionType } from '../types/ActionType';
import TransferList from '../components/TransferList';

const Transfers: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const [ href, setHref ] = useState('');
    const dispatch = useDispatch();

    const activeTransfers = useSelector((store: StateType) => store.activeTransfers);
    const incomingTransfers = useSelector((store: StateType) => store.incomingTransfers);
    const outgoingTransfers = useSelector((store: StateType) => store.outgoingTransfers);

    useEffect(() => {
        setHref(window.location.href);
        dispatch({ type: ActionType.SET_NAME, value: code });
    }, [ setHref, code, dispatch ])

    const onDrop = useCallback((files: File[]) => {
        for (let file of files) {
            dispatch({ type: ActionType.CREATE_TRANSFER, value: file });
        }
    }, [ dispatch ]);

    return (
        <section className="desktop-2col">
            <div>
                <h2>Transfer files:</h2>
                <div className="center qrcode subsection">
                    <p>Scan this QR code:</p>
                    <QrCode value={ href } />
                    <p>or open this URL on another device:</p>
                    <pre>
                        { href }
                    </pre>
                </div>
            </div>
            <div>
                <TransferList transfers={activeTransfers} type={'active'} />
                <TransferList transfers={incomingTransfers} type={'incoming'} />
                <TransferList transfers={outgoingTransfers} type={'outgoing'} />
                <h2>Create a new transfer:</h2>
                <Dropzone onDrop={onDrop}>
                    {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="subsection dropzone">
                        <input {...getInputProps()} accept={'*'} />
                        <div>To send files, drag and drop them here</div>
                        <div>or click on this area to open a file selection dialog.</div>
                    </div>
                    )}
                </Dropzone>
            </div>
        </section>
    );
}

export default Transfers;
