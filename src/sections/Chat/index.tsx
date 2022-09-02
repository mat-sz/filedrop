import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from 'react-nano-scrollbar';
import Textarea from 'react-expanding-textarea';
import { FaPaperPlane } from 'react-icons/fa';

import { StateType } from '../../reducers';
import { sendChatMessageAction } from '../../actions/state';
import { animationPropsOpacity } from '../../animationSettings';
import Animate from '../../components/Animate';
import ChatItem from './ChatItem';

const Chat: React.FC = () => {
  const chat = useSelector((store: StateType) => store.chat);
  const privateKey = useSelector((store: StateType) => store.privateKey);
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLUListElement | null>(null);

  const [message, setMessage] = useState('');
  const onSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();

    if (!message) {
      return;
    }

    dispatch(sendChatMessageAction(message));
    setMessage('');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      onSubmit(e);
    }
  };

  useEffect(() => {
    const lastElement = containerRef.current?.lastElementChild;
    if (lastElement) {
      lastElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'start',
      });
    }
  }, [chat]);

  // Disable chat if Web Crypto is not supported.
  if (!privateKey) {
    return null;
  }

  return (
    <>
      <h2>Chat</h2>
      <div className="subsection chat center">
        {chat.length === 0 && (
          <Animate component="span" {...animationPropsOpacity}>
            <div>No chat messages... so far.</div>
          </Animate>
        )}
        <ScrollArea hideScrollbarX className="chat-items">
          <ul ref={containerRef}>
            <AnimatePresence>
              {chat.map(item => (
                <ChatItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </ul>
        </ScrollArea>
        <form onSubmit={onSubmit}>
          <Textarea
            value={message}
            onKeyDown={onKeyDown}
            onChange={e => setMessage((e.target as any).value)}
          />
          <button className="icon-button">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;
