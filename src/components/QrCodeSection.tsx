import React, { useState, useCallback } from 'react';
import QrCode from 'qrcode.react';
import CopyToClipboard from 'react-copy-to-clipboard';

interface QrCodeSectionProps {
    href: string
};

const QrCodeSection: React.FC<QrCodeSectionProps> = ({ href }) => {
    const [ copied, setCopied ] = useState(false);

    const onCopy = useCallback(() => setCopied(true), [ setCopied ]);

    return (
        <div>
            <h2>Invite</h2>
            <div className="center qrcode subsection">
                <div>
                    <strong>Scan this QR code:</strong>
                </div>
                <QrCode value={ href } />
                <div>
                    <strong>or open this URL on another device:</strong>
                </div>
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
