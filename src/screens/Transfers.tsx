import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import QrCode from 'qrcode.react';
import Dropzone from 'react-dropzone';

const Transfers: React.FC = () => {
    const { code } = useParams<{ code: string }>();

    const onDrop = useCallback(() => {
        
    }, []);

    return (
        <div className="screen">
            <div>
                Your code is: <span>{ code }</span>
            </div>
            <div>
                Scan this QR code:
                <QrCode value={ window.location.href } />
                or open this URL on another device: { window.location.href }
            </div>
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
