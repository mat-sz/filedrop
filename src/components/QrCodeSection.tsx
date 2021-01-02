import React, { useState, useCallback } from 'react';
import QrCode from 'qrcode.react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaShare, FaCopy } from 'react-icons/fa';

import { showCliToolInfo, title } from '../config';
import Chat from './Chat';

interface QrCodeSectionProps {
  href: string;
}

const shareSupported = !!(navigator as any).share;

const QrCodeSection: React.FC<QrCodeSectionProps> = ({ href }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => setCopied(true), [setCopied]);
  const onShare = useCallback(() => {
    (navigator as any).share({
      title: title + ' - transfer files',
      url: href,
    });
  }, [href]);

  return (
    <div>
      <h2>Connect</h2>
      <div className="qrcode subsection">
        <div className="info">
          {showCliToolInfo ? (
            <>
              To connect to your network and start copying files, scan the QR
              code below, open the URL on another device, or use the dedicated{' '}
              <a
                href="https://github.com/mat-sz/droplol"
                target="_blank"
                rel="noopener noreferrer"
              >
                CLI tool
              </a>{' '}
              (available on npm).
            </>
          ) : (
            <>
              To connect to your network and start copying files, scan the QR
              code below, or open the URL on another device.
            </>
          )}
        </div>
        <div>
          <QrCode value={href} />
        </div>
        <div>
          <pre>{href}</pre>
          <div className="buttons">
            <CopyToClipboard text={href} onCopy={onCopy}>
              <button>
                <FaCopy /> {copied ? 'Copied' : 'Copy'}
              </button>
            </CopyToClipboard>
            {shareSupported && (
              <button onClick={onShare}>
                <FaShare /> Share
              </button>
            )}
          </div>
        </div>
      </div>
      <h2>Chat</h2>
      <Chat />
    </div>
  );
};

export default QrCodeSection;
