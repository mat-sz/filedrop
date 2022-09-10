import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaLock, FaMobile } from 'react-icons/fa';

import { StateType } from '../../reducers';
import Network from '../../components/Network';
import { uuidToColor } from '../../utils/color';
import { deviceType } from '../../utils/browser';
import { DeviceType } from '../../types/DeviceType';
import TransferList from './TransferList';
import ClientName from './ClientName';

const TransfersSection: React.FC = () => {
  const { t } = useTranslation();
  const clientId = useSelector((store: StateType) => store.clientId);
  const noticeText = useSelector((store: StateType) => store.noticeText);
  const noticeUrl = useSelector((store: StateType) => store.noticeUrl);
  const publicKey = useSelector((state: StateType) => state.publicKey);

  return (
    <div>
      {!!noticeText && (
        <div className="subsection notice">
          {noticeUrl ? <a href={noticeUrl}>{noticeText}</a> : noticeText}
        </div>
      )}
      <div className="subsection info-grid">
        <div className="image">
          <div
            className="network-tile"
            style={{
              backgroundColor: uuidToColor(clientId),
            }}
          >
            {!!publicKey && (
              <div className="secure">
                <FaLock />
              </div>
            )}
            {deviceType === DeviceType.MOBILE && (
              <div className="device">
                <FaMobile />
              </div>
            )}
            {t('you')}
          </div>
        </div>
        <div className="info">
          <ClientName />
          <div>
            <strong>{t('yourTile.title')}</strong> {t('yourTile.body')}
          </div>
        </div>
      </div>
      <Network />
      <TransferList />
    </div>
  );
};

export default TransfersSection;
