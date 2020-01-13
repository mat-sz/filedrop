import React from 'react';
import QrCode from 'qrcode.react';

const QrCodeSection: React.FC<{ href: string }> = ({ href }) => {
    return (
        <div>
            <h2>Invite</h2>
            <div className="center qrcode subsection">
                <p>Scan this QR code:</p>
                <QrCode value={ href } />
                <p>or open this URL on another device:</p>
                <pre>
                    { href }
                </pre>
            </div>
        </div>
    );
}

export default QrCodeSection;
