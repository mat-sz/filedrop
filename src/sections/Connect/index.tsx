import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaPaperPlane, FaCopy } from 'react-icons/fa';

import { title } from '../../config';
import { copy } from '../../utils/copy';

interface ConnectSectionProps {
  href: string;
}

const shareSupported = !!(navigator as any).share;

const ConnectSection: React.FC<ConnectSectionProps> = ({ href }) => {
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
        <button className="icon-button" onClick={() => copy(href)}>
          <FaCopy />
        </button>
        {shareSupported && (
          <button onClick={onShare} className="icon-button">
            <FaPaperPlane />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConnectSection;
