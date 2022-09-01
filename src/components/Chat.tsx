import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Textarea from 'react-expanding-textarea';

import { StateType } from '../reducers';
import { sendChatMessageAction } from '../actions/state';
import { animationPropsOpacity } from '../animationSettings';
import ChatItem from './ChatItem';

const Chat: React.FC = () => {
  const chat = useSelector((store: StateType) => store.chat);
  const privateKey = useSelector((store: StateType) => store.privateKey);
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLElement | null>(null);

  const [message, setMessage] = useState('');
  const onSubmit = useCallback(
    (e: React.FormEvent | React.KeyboardEvent) => {
      e.preventDefault();

      if (!message) {
        return;
      }

      dispatch(sendChatMessageAction(message));
      setMessage('');
    },
    [dispatch, message, setMessage]
  );
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        onSubmit(e);
      }
    },
    [onSubmit]
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chat]);

  // Disable chat if Web Crypto is not supported.
  if (!privateKey) {
    return null;
  }

  return (
    <div className="subsection chat">
      {chat.length === 0 && (
        <motion.span {...animationPropsOpacity}>
          <div>No chat messages... so far.</div>
        </motion.span>
      )}
      <PerfectScrollbar
        component="ul"
        containerRef={element => (containerRef.current = element)}
      >
        <AnimatePresence>
          {chat.map(item => (
            <ChatItem key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </PerfectScrollbar>
      <form onSubmit={onSubmit}>
        <Textarea
          value={message}
          onKeyDown={onKeyDown}
          onChange={e => setMessage((e.target as any).value)}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default Chat;
