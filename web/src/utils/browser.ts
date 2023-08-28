import { abbreviatedSha } from '~build/info';
import { DeviceType } from '@filedrop/types';

export const isShareSupported = !!(navigator as any).share;
export const isWebRTCSupported = 'RTCPeerConnection' in window;
export const isORTCSupported = 'RTCIceGatherer' in window;
export const isWebSocketSupported =
  'WebSocket' in window && 2 === window.WebSocket.CLOSING;
export const isFileReaderSupported = 'FileReader' in window;
export const isClipboardItemSupported = 'ClipboardItem' in window;
export const isClipboardReadSupported =
  'clipboard' in navigator && !!navigator.clipboard.read;
export const isBrowserCompatible =
  isWebRTCSupported && isWebSocketSupported && isFileReaderSupported;
export const isMobile = /iPhone|Android/i.test(navigator.userAgent);
export const isTablet = /iPad|tablet/i.test(navigator.userAgent);
export const deviceType: DeviceType = isTablet
  ? DeviceType.TABLET
  : isMobile
  ? DeviceType.MOBILE
  : DeviceType.DESKTOP;
export const isSafari =
  navigator.vendor && navigator.vendor.indexOf('Apple') > -1;
export const iOS =
  [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod',
  ].includes(navigator.platform) ||
  // iPad on iOS 13 detection
  (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
export const commitHash = abbreviatedSha;
