import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';

import { StateType } from '../reducers';
import { animationPropsOpacity } from '../animationSettings';
import Animate from './Animate';

const Status: React.FC = () => {
  const connected = useSelector((state: StateType) => state.connected);
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {!connected ? (
        <Animate
          component="div"
          {...animationPropsOpacity}
          className="status error"
        >
          <div>{t('state.connecting')}</div>
        </Animate>
      ) : null}
    </AnimatePresence>
  );
};

export default Status;
