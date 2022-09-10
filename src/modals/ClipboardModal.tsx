import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

import Network from '../components/Network';
import Animate from '../components/Animate';
import { createTransferAction } from '../actions/transfers';
import { animationPropsOpacity } from '../animationSettings';

interface ClipboardModalProps {
  files: File[];
  dismissClipboard: () => void;
}

const ClipboardModal: React.FC<ClipboardModalProps> = ({
  files,
  dismissClipboard,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fileNames = files.map((file, i) => file.name).join(', ');

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
            {t('clipboard.title')}
            <button className="icon-button" onClick={dismissClipboard}>
              <FaTimes />
            </button>
          </h2>
          <p>{t('clipboard.body', { fileNames })}</p>
          <Network onSelect={onSelect} />
        </div>
      </div>
    </Animate>
  );
};

export default ClipboardModal;
