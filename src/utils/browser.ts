export const isShareSupported = !!(navigator as any).share;
export const isWebRTCSupported = 'RTCPeerConnection' in window;
export const isORTCSupported = 'RTCIceGatherer' in window;
export const isWebSocketSupported =
  'WebSocket' in window && 2 === window.WebSocket.CLOSING;
export const isFileReaderSupported = 'FileReader' in window;
export const isBrowserCompatible =
  isWebRTCSupported && isWebSocketSupported && isFileReaderSupported;
