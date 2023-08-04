import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18not';
import { IoSend, IoCopy } from 'react-icons/io5';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import styles from './index.module.scss';
import { copy } from '../../utils/copy';
import { isShareSupported } from '../../utils/browser';
import { IconButton } from '../../components/IconButton';
import { OtherNetworks } from './OtherNetworks';
import { applicationStore } from '../../stores/ApplicationStore';

interface ConnectSectionProps {
  href: string;
}

export const ConnectSection: React.FC<ConnectSectionProps> = observer(
  ({ href }) => {
    const appName = applicationStore.appName;
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
        <div className={styles.qrcode}>
          <QRCodeSVG value={href} size={192} />
        </div>
        <div className={styles.share}>
          <div className={styles.copy}>
            <pre>{href}</pre>
            <div className={styles.buttons}>
              <IconButton onClick={() => copy(href)}>
                <IoCopy />
              </IconButton>
              {isShareSupported && (
                <IconButton onClick={onShare}>
                  <IoSend />
                </IconButton>
              )}
            </div>
          </div>
        </div>
        <div className={styles.other}>
          <OtherNetworks />
        </div>
      </div>
    );
  }
);
