import React from 'react';
import { useParams } from 'react-router-dom';
import QrCode from 'qrcode.react';

const Transfers: React.FC = () => {
    const { code } = useParams<{ code: string }>();

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
        </div>
    );
}

export default Transfers;
