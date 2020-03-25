import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

import Network from '../components/Network';
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
  const dispatch = useDispatch();

  const onSelect = useCallback(
    (clientId: string) => {
      for (let file of files) {
        dispatch(createTransferAction(file, clientId));
      }

      dismissClipboard();
    },
    [dispatch, files, dismissClipboard]
  );

  return (
    <motion.div className="modal" {...animationPropsOpacity}>
      <div>
        <section>
          <h2>Send clipboard contents</h2>
          <Network onSelect={onSelect} />
        </section>
        <div className="center">
          <button onClick={dismissClipboard}>Cancel</button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClipboardModal;
