import React from 'react';
import { useSelector } from 'react-redux';
import { StateType } from '../reducers';
import {
  isFileReaderSupported,
  isORTCSupported,
  isWebRTCSupported,
  isWebSocketSupported,
} from '../utils/browser';

const TechnicalInformation: React.FC = () => {
  const remoteAddress = useSelector(
    (state: StateType) => state.remoteAddress || 'Connecting?'
  );

  return (
    <section>
      <div className="subsection left">
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
      </div>
    </section>
  );
};

export default TechnicalInformation;
