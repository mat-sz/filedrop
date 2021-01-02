import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import { StateType } from '../reducers';
import { sendChatMessageAction } from '../actions/state';

const Chat: React.FC = () => {
  const chat = useSelector((store: StateType) => store.chat);
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const sendMessage = useCallback(() => {
    if (!message) {
      return;
    }

    dispatch(sendChatMessageAction(message));
    setMessage('');
  }, [dispatch, message, setMessage]);

  return (
    <div className="subsection chat">
      <ul>
        <AnimatePresence>
          {chat.map(item => (
            <li key={item.id}>
              <div
                className="network-tile target-tile"
                style={{
                  backgroundColor: item.clientColor,
                }}
              />
              <div className="chat-message">{item.message}</div>
            </li>
          ))}
        </AnimatePresence>
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default Chat;
