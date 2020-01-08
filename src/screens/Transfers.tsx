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
        <div className="section">
            <h2>Transfer files:</h2>
            <div className="center qrcode">
                <p>Scan this QR code:</p>
                <QrCode value={ href } />
                <p>or open this URL on another device:</p>
                <pre>
                    { href }
                </pre>
            </div>
            <ul className="center queue">
                { activeTransfers.map((transfer) =>
                    <li key={transfer.transferId}>
                        <div>{ transfer.fileName }</div>
                    </li>
                )}
            </ul>
            <h2>Incoming transfers:</h2>
            <ul className="center queue">
                { incomingTransfers.map((transfer) =>
                    <li key={transfer.transferId}>
                        <div>{ transfer.fileName }</div>
                        <button onClick={() => dispatch({ type: ActionType.ACCEPT_TRANSFER, value: transfer.transferId })}>Accept</button>
                        <button onClick={() => dispatch({ type: ActionType.REJECT_TRANSFER, value: transfer.transferId })}>Reject</button>
                    </li>
                )}
            </ul>
            <h2>Your transfers:</h2>
            <ul className="center queue">
                { outgoingTransfers.map((transfer) =>
                    <li key={transfer.transferId}>
                        <div>{ transfer.fileName }</div>
                        <button onClick={() => dispatch({ type: ActionType.CANCEL_TRANSFER, value: transfer.transferId })}>Cancel</button>
                    </li>
                )}
            </ul>
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
