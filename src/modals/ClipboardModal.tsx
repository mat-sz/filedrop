import React from 'react';
import { useDispatch } from 'react-redux';

import Network from '../components/Network';
import Animate from '../components/Animate';
import { createTransferAction } from '../actions/transfers';
import { animationPropsOpacity } from '../animationSettings';
import { FaTimes } from 'react-icons/fa';

interface ClipboardModalProps {
  files: File[];
  dismissClipboard: () => void;
}

const ClipboardModal: React.FC<ClipboardModalProps> = ({
  files,
  dismissClipboard,
}) => {
  const dispatch = useDispatch();

  const onSelect = (clientId: string) => {
    for (let file of files) {
      dispatch(createTransferAction(file, clientId));
    }

    dismissClipboard();
  };

  return (
    <Animate component="div" className="modal" {...animationPropsOpacity}>
      <div>
        <div className="subsection left">
          <h2>
            Send clipboard contents
            <button className="icon-button" onClick={dismissClipboard}>
              <FaTimes />
            </button>
          </h2>
          <p>
            Sending:{' '}
            {files.map((file, i) => (
              <span key={i}>
                {file.name}
                {i < files.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
          <Network onSelect={onSelect} />
        </div>
      </div>
    </Animate>
  );
};

export default ClipboardModal;
