import React from 'react';
import { observer } from 'mobx-react-lite';

import {
  isFileReaderSupported,
  isORTCSupported,
  isWebRTCSupported,
  isWebSocketSupported,
} from '../utils/browser';
import { TextSection } from '../components/TextSection';
import { applicationStore } from '../stores/ApplicationStore';

export const TechnicalInformation: React.FC = observer(() => {
  const remoteAddress = applicationStore.remoteAddress;

  return (
    <TextSection>
      <h2>Technical Information</h2>
      <ul>
        <li>
          <strong>Remote address:</strong> {remoteAddress}
        </li>
        <li>
          <strong>User agent:</strong> {navigator.userAgent}
        </li>
        <li>
          <strong>WebRTC:</strong> {isWebRTCSupported ? 'Yes' : 'No'}
        </li>
        <li>
          <strong>ORTC:</strong> {isORTCSupported ? 'Yes' : 'No'}
        </li>
        <li>
          <strong>WebSockets:</strong> {isWebSocketSupported ? 'Yes' : 'No'}
        </li>
        <li>
          <strong>FileReader API:</strong>{' '}
          {isFileReaderSupported ? 'Yes' : 'No'}
        </li>
      </ul>
    </TextSection>
  );
});
