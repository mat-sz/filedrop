import React, { useLayoutEffect, useRef, useState } from 'react';
import ReactTimeago from 'react-timeago';
import { FaCopy } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { animationPropsSlide } from '../../animationSettings';
import { ChatItemModel } from '../../types/Models';
import { StateType } from '../../reducers';
import { uuidToColor } from '../../utils/color';
import { copy } from '../../utils/copy';
import Animate from '../../components/Animate';

export interface ChatItemProps {
  item: ChatItemModel;
}

const ChatItem: React.FC<ChatItemProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const client = useSelector((state: StateType) =>
    state.network?.find(client => client.clientId === item.clientId)
  );

  useLayoutEffect(() => {
    if (messageRef.current!.offsetHeight < 50) {
      setExpanded(true);
    }
  }, [setExpanded]);

  return (
    <Animate
      component="li"
      className={'subsection ' + (expanded ? 'chat-expanded' : '')}
      {...animationPropsSlide}
      aria-label="Chat message"
    >
      <div className="chat-info">
        <div
          className="network-tile target-tile"
          style={{
            backgroundColor: uuidToColor(item.clientId),
          }}
        />
        <div>{client?.clientName}</div>
        <div>
          <ReactTimeago date={item.date} />
        </div>
        <button className="icon-button" onClick={() => copy(item.message)}>
          <FaCopy />
        </button>
      </div>
      <div className="chat-message" ref={messageRef}>
        {item.message}
      </div>
      {!expanded && (
        <button className="chat-message-more" onClick={() => setExpanded(true)}>
          Show more
        </button>
      )}
    </Animate>
  );
};

export default ChatItem;
