import React, { useState, useCallback } from 'react';
import QrCode from 'qrcode.react';
import CopyToClipboard from 'react-copy-to-clipboard';

const QrCodeSection: React.FC<{ href: string }> = ({ href }) => {
    const [ copied, setCopied ] = useState(false);

    const onCopy = useCallback(() => setCopied(true), [ setCopied ]);

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
                <CopyToClipboard
                    text={href}
                    onCopy={onCopy}
                >
                    <button>
                        { copied ? 'Copied' : 'Copy to clipboard' }
                    </button>
                </CopyToClipboard>
            </div>
        </div>
    );
}

export default QrCodeSection;
