import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReactTimeago from 'react-timeago';
import { FaCopy } from 'react-icons/fa';

import { animationPropsSlide } from '../animationSettings';
import { ChatItemModel } from '../types/Models';

export interface ChatItemProps {
  item: ChatItemModel;
}

const ChatItem: React.FC<ChatItemProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messageRef.current?.offsetHeight < 50) {
      setExpanded(true);
    }
  }, [setExpanded]);

  return (
    <motion.li
      className={'subsection info-grid ' + (expanded ? 'chat-expanded' : '')}
      {...animationPropsSlide}
      aria-label="Chat message"
    >
      <div className="chat-info">
        <div
          className="network-tile target-tile"
          style={{
            backgroundColor: item.clientColor,
          }}
        />
        <div>
          <ReactTimeago date={item.date} />
        </div>
        <CopyToClipboard text={item.message}>
          <button className="chat-action">
            <FaCopy />
          </button>
        </CopyToClipboard>
      </div>
      <div className="chat-message" ref={messageRef}>
        {item.message}
      </div>
      {!expanded && (
        <button className="chat-message-more" onClick={() => setExpanded(true)}>
          Show more
        </button>
      )}
    </motion.li>
  );
};

export default ChatItem;
