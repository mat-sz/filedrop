import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { FaLock, FaMobile, FaNetworkWired, FaPlus } from 'react-icons/fa';

import { ClientModel } from '../types/Models';
import { createTransferAction } from '../actions/transfers';
import { animationPropsOpacity } from '../animationSettings';
import { StateType } from '../reducers';
import { uuidToColor } from '../utils/color';
import Animate from './Animate';
import { DeviceType } from '../types/DeviceType';

interface NetworkTileProps {
  client: ClientModel;
  onSelect?: (clientId: string) => void;
}

const NetworkTile: React.FC<NetworkTileProps> = ({ client, onSelect }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const publicKey = useSelector((state: StateType) => state.publicKey);

  const onDrop = (files: File[]) => {
    for (let file of files) {
      dispatch(createTransferAction(file, client.clientId));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const preventClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const onClick = () => {
    onSelect?.(client.clientId);
  };

  const contents = (
    <>
      <FaPlus />
      {!!publicKey && !!client.publicKey && (
        <div className="secure">
          <FaLock />
        </div>
      )}
      {client.isLocal && (
        <div className="local">
          <FaNetworkWired />
        </div>
      )}
      {client.deviceType === DeviceType.MOBILE && (
        <div className="device">
          <FaMobile />
        </div>
      )}
    </>
  );

  return (
    <Animate
      component="div"
      {...animationPropsOpacity}
      onClick={onClick}
      className="network-tile-wrapper"
    >
      {onSelect ? (
        <div
          className="network-tile"
          style={{
            backgroundColor: uuidToColor(client.clientId),
          }}
        >
          {contents}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={'network-tile ' + (isDragActive ? 'active' : '')}
          style={{
            backgroundColor: uuidToColor(client.clientId),
          }}
        >
          <label onClick={preventClick}>
            <input
              {...getInputProps({
                style: {},
              })}
              accept={'*'}
              tabIndex={1}
            />
            {t('tile')}
          </label>
          {contents}
        </div>
      )}
      <div className="network-tile-name">{client.clientName}</div>
    </Animate>
  );
};

export default NetworkTile;
