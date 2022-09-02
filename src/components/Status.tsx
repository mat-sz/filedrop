import React from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import { StateType } from '../reducers';
import { animationPropsOpacity } from '../animationSettings';
import Animate from './Animate';

const Status: React.FC = () => {
  const connected = useSelector((state: StateType) => state.connected);

  return (
    <AnimatePresence>
      {!connected ? (
        <Animate
          component="div"
          {...animationPropsOpacity}
          className="status error"
        >
          <div>Connecting...</div>
        </Animate>
      ) : null}
    </AnimatePresence>
  );
};

export default Status;
