import React, { useMemo } from 'react';
import clsx from 'clsx';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18not';
import { IoSend, IoCopy } from 'react-icons/io5/index.js';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import styles from './index.module.scss';
import { copy } from '../../utils/copy.js';
import { isShareSupported } from '../../utils/browser.js';
import { IconButton } from '../../components/IconButton.js';
import { applicationStore, networkStore } from '../../stores/index.js';
import { LocalNetworks } from '../LocalNetworks/index.js';

export const ConnectSection: React.FC = observer(() => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const href = useMemo(() => window.location.href, [pathname]);

  return (
    <>
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
                <IconButton onClick={() => copy(href)} title={t('copy')}>
                  <IoCopy />
                </IconButton>
                {isShareSupported && (
                  <IconButton
                    onClick={() => applicationStore.share(href)}
                    title={t('share')}
                  >
                    <IoSend />
                  </IconButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!!networkStore.otherNetworks.length && (
        <div className={clsx('subsection', styles.other)}>
          <span>{t('localNetworks')}</span>
          <LocalNetworks />
        </div>
      )}
    </>
  );
});
