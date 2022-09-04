import React from 'react';
import { useSelector } from 'react-redux';
import { StateType } from '../reducers';

const TechnicalInformation: React.FC = () => {
  const remoteAddress = useSelector(
    (state: StateType) => state.remoteAddress || 'Connecting?'
  );

  const isWebRTCSupported = 'RTCPeerConnection' in window;
  const isORTCSupported = 'RTCIceGatherer' in window;
  const isWebSocketsSupported =
    'WebSocket' in window && 2 === window.WebSocket.CLOSING;
  const isFileReaderSupported = 'FileReader' in window;

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
            <strong>WebSockets:</strong> {isWebSocketsSupported ? 'Yes' : 'No'}
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
