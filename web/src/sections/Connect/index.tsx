import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18not';
import { FaPaperPlane, FaCopy } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import styles from './index.module.scss';
import { StateType } from '../../reducers';
import { copy } from '../../utils/copy';
import { isShareSupported } from '../../utils/browser';
import { IconButton } from '../../components/IconButton';

interface ConnectSectionProps {
  href: string;
}

export const ConnectSection: React.FC<ConnectSectionProps> = ({ href }) => {
  const appName = useSelector((state: StateType) => state.appName);
  const { t } = useTranslation();
  const onShare = () => {
    (navigator as any).share({
      title: appName + ' - transfer files',
      url: href,
    });
  };

  return (
    <div className={clsx(styles.connect, 'subsection')}>
      <div className={styles.info}>{t('connect')}</div>
      <div>
        <QRCodeSVG value={href} size={192} className={styles.qrcode} />
      </div>
      <div className={styles.copy}>
        <pre>{href}</pre>
        <IconButton onClick={() => copy(href)}>
          <FaCopy />
        </IconButton>
        {isShareSupported && (
          <IconButton onClick={onShare}>
            <FaPaperPlane />
          </IconButton>
        )}
      </div>
    </div>
  );
};
