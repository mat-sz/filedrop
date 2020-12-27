import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { FaLock, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { ClientModel } from '../types/Models';
import { createTransferAction } from '../actions/transfers';
import { animationPropsRotation } from '../animationSettings';
import { StateType } from '../reducers';

interface NetworkTileProps {
  client: ClientModel;
  onSelect?: (clientId: string) => void;
}

const NetworkTile: React.FC<NetworkTileProps> = ({ client, onSelect }) => {
  const dispatch = useDispatch();
  const publicKey = useSelector((state: StateType) => state.publicKey);

  const onDrop = useCallback(
    (files: File[]) => {
      for (let file of files) {
        dispatch(createTransferAction(file, client.clientId));
      }
    },
    [dispatch, client.clientId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const preventClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const onClick = useCallback(() => {
    onSelect(client.clientId);
  }, [client, onSelect]);

  return (
    <motion.div {...animationPropsRotation} onClick={onSelect ? onClick : null}>
      {onSelect ? (
        <div
          className="network-tile"
          style={{
            backgroundColor: client.clientColor,
          }}
        >
          <FaPlus />
          {!!publicKey && !!client.publicKey && (
            <div className="secure">
              <FaLock />
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={'network-tile ' + (isDragActive ? 'active' : '')}
          style={{
            backgroundColor: client.clientColor,
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
            Click on this area to start a transfer.
          </label>
          <FaPlus />
          {client.publicKey && (
            <div className="secure">
              <FaLock />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default NetworkTile;
