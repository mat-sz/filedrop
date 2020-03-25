import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

import Welcome from '../screens/Welcome';
import { dismissWelcomeAction } from '../actions/state';
import { animationPropsOpacity } from '../animationSettings';

const WelcomeModal: React.FC = () => {
  const dispatch = useDispatch();

  const dismissWelcome = useCallback(() => {
    dispatch(dismissWelcomeAction());
  }, [dispatch]);

  return (
    <motion.div className="modal" {...animationPropsOpacity}>
      <div>
        <Welcome />
        <div className="center">
          <button onClick={dismissWelcome}>Continue</button>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeModal;
