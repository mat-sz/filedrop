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
            <h2>Connect</h2>
            <div className="subsection">
                The CLI tool for drop.lol is now available. <a href="https://github.com/mat-sz/droplol" target="_blank" rel="noopener noreferrer">Get it here now!</a>
            </div>
            <div className="qrcode subsection">
                <div className="info">
                    To connect to your network and start copying files, scan the QR code below, or open the URL on another device.
                </div>
                <div>
                    <QrCode value={ href } />
                </div>
                <div>
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
        </div>
    );
}

export default QrCodeSection;
