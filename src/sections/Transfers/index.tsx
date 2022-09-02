import React from 'react';
import { useSelector } from 'react-redux';

import { StateType } from '../../reducers';
import Network from '../../components/Network';
import { uuidToColor } from '../../utils/color';
import TransferList from './TransferList';
import ClientName from './ClientName';

const TransfersSection: React.FC = () => {
  const clientId = useSelector((store: StateType) => store.clientId);
  const noticeText = useSelector((store: StateType) => store.noticeText);
  const noticeUrl = useSelector((store: StateType) => store.noticeUrl);

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
            You
          </div>
        </div>
        <div className="info">
          <ClientName />
          <div>
            <strong>This is your tile.</strong> Beneath you'll see other tiles
            just like this one. Drag and drop your files or click on them to
            initiate a file transfer.
          </div>
        </div>
      </div>
      <Network />
      <TransferList />
    </div>
  );
};

export default TransfersSection;
