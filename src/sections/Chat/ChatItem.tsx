import React, { useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaCopy } from 'react-icons/fa';

import { animationPropsSlide } from '../../animationSettings';
import { ChatItemModel } from '../../types/Models';
import { StateType } from '../../reducers';
import { uuidToColor } from '../../utils/color';
import { copy } from '../../utils/copy';
import Animate from '../../components/Animate';

export interface ChatItemProps {
  item: ChatItemModel;
}

const urlify = (text: string): React.ReactNode => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a href={part} key={i}>
          {part}
        </a>
      );
    }

    return part;
  });
};

const ChatItem: React.FC<ChatItemProps> = ({ item }) => {
  const { t, i18n } = useTranslation();
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
          {item.date.toLocaleTimeString(i18n.language, { timeStyle: 'short' })}
        </div>
        <button className="icon-button" onClick={() => copy(item.message)}>
          <FaCopy />
        </button>
      </div>
      <div className="chat-message" ref={messageRef}>
        {urlify(item.message)}
      </div>
      {!expanded && (
        <button className="chat-message-more" onClick={() => setExpanded(true)}>
          {t('chat.showMore')}
        </button>
      )}
    </Animate>
  );
};

export default ChatItem;
