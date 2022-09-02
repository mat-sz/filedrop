import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaShare, FaCopy } from 'react-icons/fa';

import { title } from '../../config';

interface ConnectSectionProps {
  href: string;
}

const shareSupported = !!(navigator as any).share;

const ConnectSection: React.FC<ConnectSectionProps> = ({ href }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => setCopied(true);
  const onShare = () => {
    (navigator as any).share({
      title: title + ' - transfer files',
      url: href,
    });
  };

  return (
    <div className="connect center subsection">
      <div className="info">
        Open this page on your other device to copy files:
      </div>
      <div>
        <QRCodeSVG value={href} size={192} className="qrcode" />
      </div>
      <div className="copy">
        <pre>{href}</pre>
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
  );
};

export default ConnectSection;
