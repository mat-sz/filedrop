export enum MessageType {
  INITIALIZE = 'initialize',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  APP_INFO = 'appInfo',
  CLIENT_INFO = 'clientInfo',
  LOCAL_NETWORKS = 'localNetworks',
  NETWORK_NAME = 'networkName',
  CLIENT_NAME = 'clientName',
  CHAT = 'chat',
  TRANSFER = 'transfer',
  ACTION = 'action',
  NETWORK = 'network',
  PING = 'ping',
  RTC_DESCRIPTION = 'rtcDescription',
  RTC_CANDIDATE = 'rtcCandidate',
  ENCRYPTED = 'encrypted',
}

export enum ActionMessageActionType {
  ACCEPT = 'accept',
  CANCEL = 'cancel',
}
