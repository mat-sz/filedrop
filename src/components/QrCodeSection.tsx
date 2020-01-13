import React from 'react';
import QrCode from 'qrcode.react';

const QrCodeSection: React.FC<{ href: string }> = ({ href }) => {
    return (
        <div>
            <h2>Invite</h2>
            <div className="center qrcode subsection">
                <div>Scan this QR code:</div>
                <QrCode value={ href } />
                <div>or open this URL on another device:</div>
                <pre>
                    { href }
                </pre>
            </div>
        </div>
    );
}

export default QrCodeSection;
