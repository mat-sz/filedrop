import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { animationPropsOpacity } from '../animationSettings';
import { StateType } from '../reducers';
import {
  setClientNameAction,
  setClientNameModalAction,
} from '../actions/state';

const ClientNameModal: React.FC = () => {
  const dispatch = useDispatch();
  const clientName = useSelector((state: StateType) => state.clientName);
  const [name, setName] = useState(clientName);

  const onSave = () => {
    if (name) {
      dispatch(setClientNameAction(name));
    }
    dispatch(setClientNameModalAction(false));
  };

  const onDismiss = () => {
    dispatch(setClientNameModalAction(false));
  };

  return (
    <motion.div className="modal" {...animationPropsOpacity}>
      <div>
        <section>
          <h2>Change client name</h2>
          <div className="subsection">
            <input
              type="text"
              placeholder="Client name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <div className="actions">
              <button onClick={onDismiss}>Cancel</button>
              <button onClick={onSave}>Save</button>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default ClientNameModal;
