import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaEdit } from 'react-icons/fa';

import { setClientNameModalAction } from '../actions/state';
import { StateType } from '../reducers';
import TransferList from './TransferList';
import Network from './Network';

const TransfersSection: React.FC = () => {
  const dispatch = useDispatch();
  const clientName = useSelector((store: StateType) => store.clientName);
  const clientColor = useSelector((store: StateType) => store.clientColor);
  const noticeText = useSelector((store: StateType) => store.noticeText);
  const noticeUrl = useSelector((store: StateType) => store.noticeUrl);

  const onShowClientNameModal = () => {
    dispatch(setClientNameModalAction(true));
  };

  return (
    <div>
      <h2>Your network</h2>
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
              backgroundColor: clientColor,
            }}
          >
            You
          </div>
        </div>
        <div className="info">
          {clientName && (
            <div className="client-name">
              <strong>{clientName}</strong>{' '}
              <button className="icon-button" onClick={onShowClientNameModal}>
                <FaEdit />
              </button>
            </div>
          )}
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
