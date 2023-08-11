import React, { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18not';
import { IoSend, IoCopy } from 'react-icons/io5';
import clsx from 'clsx';

import styles from './index.module.scss';
import { copy } from '../../utils/copy';
import { isShareSupported } from '../../utils/browser';
import { IconButton } from '../../components/IconButton';
import { OtherNetworks } from './OtherNetworks';
import { applicationStore } from '../../stores';
import { useLocation } from 'react-router-dom';

export const ConnectSection: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const href = useMemo(() => window.location.href, [pathname]);

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
              <IconButton onClick={() => applicationStore.share(href)}>
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
};
