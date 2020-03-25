import React from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

import { StateType } from '../reducers';
import { animationPropsOpacity } from '../animationSettings';

const Status: React.FC = () => {
  const connected = useSelector((state: StateType) => state.connected);

  return (
    <AnimatePresence>
      {!connected ? (
        <motion.div {...animationPropsOpacity} className="status error">
          <div>Connecting...</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Status;
