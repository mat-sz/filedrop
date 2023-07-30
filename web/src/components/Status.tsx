import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from '../animate';

import { StateType } from '../reducers';
import { animationPropsOpacity } from '../animationSettings';

const Status: React.FC = () => {
  const connected = useSelector((state: StateType) => state.connected);
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {!connected ? (
        <motion.div {...animationPropsOpacity} className="status error">
          <div>{t('state.connecting')}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Status;
