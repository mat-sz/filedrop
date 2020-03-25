export enum MessageType {
  WELCOME = 'welcome',
  NAME = 'name',
  TRANSFER = 'transfer',
  ACTION = 'action',
  NETWORK = 'network',
  PING = 'ping',
  RTC_DESCRIPTION = 'rtcDescription',
  RTC_CANDIDATE = 'rtcCandidate',
}

export enum ActionMessageActionType {
  ACCEPT = 'accept',
  REJECT = 'reject',
  CANCEL = 'cancel',
}
