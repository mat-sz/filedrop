import React, { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18not';
import { IoSend, IoCopy } from 'react-icons/io5/index.js';
import { useLocation } from 'react-router-dom';

import styles from './index.module.scss';
import { copy } from '../../utils/copy.js';
import { isShareSupported } from '../../utils/browser.js';
import { IconButton } from '../../components/IconButton.js';
import { OtherNetworks } from './OtherNetworks.js';
import { applicationStore } from '../../stores/index.js';

export const ConnectSection: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const href = useMemo(() => window.location.href, [pathname]);

  return (
    <div className="subsection">
      <div className={styles.connect}>
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
      </div>
      <div className={styles.other}>
        <OtherNetworks />
      </div>
    </div>
  );
};
