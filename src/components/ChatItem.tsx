import React from 'react';
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
  return (
    <motion.li
      className="subsection info-grid"
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
      <div className="chat-message">{item.message}</div>
    </motion.li>
  );
};

export default ChatItem;
