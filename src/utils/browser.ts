import { DeviceType } from '../types/DeviceType';

export const isShareSupported = !!(navigator as any).share;
export const isWebRTCSupported = 'RTCPeerConnection' in window;
export const isORTCSupported = 'RTCIceGatherer' in window;
export const isWebSocketSupported =
  'WebSocket' in window && 2 === window.WebSocket.CLOSING;
export const isFileReaderSupported = 'FileReader' in window;
export const isBrowserCompatible =
  isWebRTCSupported && isWebSocketSupported && isFileReaderSupported;
export const isMobile = /iPhone|Android/i.test(navigator.userAgent);
export const isTablet = /iPad|tablet/i.test(navigator.userAgent);
export const deviceType: DeviceType = isTablet
  ? DeviceType.TABLET
  : isMobile
  ? DeviceType.MOBILE
  : DeviceType.DESKTOP;
