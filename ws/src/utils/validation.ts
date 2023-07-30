import Joi from 'joi';

import {
  MessageModel,
  NetworkNameMessageModel,
  ClientNameMessageModel,
  TransferMessageModel,
  ActionMessageModel,
  RTCDescriptionMessageModel,
  RTCCandidateMessageModel,
  EncryptedMessageModel,
} from '../types/Models';
import { MessageType, ActionMessageActionType } from '../types/MessageType';
import { DeviceType } from '../types/DeviceType';

const messageModelSchema = Joi.object({
  type: Joi.string().alphanum().required(),
})
  .unknown(true)
  .required();

const validDeviceTypes = Object.values(DeviceType);
const networkNameMessageModelSchema = Joi.object({
  type: Joi.string().equal(MessageType.NETWORK_NAME).required(),
  networkName: Joi.string().alphanum().max(10).required(),
  publicKey: Joi.string(),
  deviceType: Joi.string().equal(...validDeviceTypes),
}).required();

const clientNameMessageModelSchema = Joi.object({
  type: Joi.string().equal(MessageType.CLIENT_NAME).required(),
  clientName: Joi.string().max(32).required(),
}).required();

const transferMessageModelSchema = Joi.object({
  type: Joi.string().equal(MessageType.TRANSFER).required(),
  transferId: Joi.string().uuid().required(),
  targetId: Joi.string().uuid().required(),
  fileName: Joi.string().required(),
  fileSize: Joi.number().required(),
  fileType: Joi.string().required(),
}).required();

const validActions = Object.values(ActionMessageActionType);
const actionMessageModelSchema = Joi.object({
  type: Joi.string().equal(MessageType.ACTION).required(),
  transferId: Joi.string().uuid().required(),
  targetId: Joi.string().uuid().required(),
  action: Joi.string()
    .equal(...validActions)
    .required(),
}).required();

const rtcDescriptionMessageModelSchema = Joi.object({
  type: Joi.string().equal(MessageType.RTC_DESCRIPTION).required(),
  transferId: Joi.string().uuid().required(),
  targetId: Joi.string().uuid().required(),
  data: Joi.object({
    type: Joi.string().required(),
    sdp: Joi.string().required(),
  }).required(),
}).required();

const rtcCandidateMessageModelSchema = Joi.object({
  type: Joi.string().equal(MessageType.RTC_CANDIDATE).required(),
  transferId: Joi.string().uuid().required(),
  targetId: Joi.string().uuid().required(),
  data: Joi.object().required(),
}).required();

const encryptedMessageModelSchema = Joi.object({
  type: Joi.string().equal(MessageType.ENCRYPTED).required(),
  payload: Joi.string().base64().required(),
  targetId: Joi.string().uuid().required(),
}).required();

export function isMessageModel(message: any): message is MessageModel {
  return !messageModelSchema.validate(message).error;
}

export function isNetworkNameMessageModel(
  message: MessageModel | NetworkNameMessageModel
): message is NetworkNameMessageModel {
  return !networkNameMessageModelSchema.validate(message).error;
}

export function isClientNameMessageModel(
  message: MessageModel | ClientNameMessageModel
): message is ClientNameMessageModel {
  return !clientNameMessageModelSchema.validate(message).error;
}

export function isTransferMessageModel(
  message: MessageModel | TransferMessageModel
): message is TransferMessageModel {
  return !transferMessageModelSchema.validate(message).error;
}

export function isActionMessageModel(
  message: MessageModel | ActionMessageModel
): message is ActionMessageModel {
  return !actionMessageModelSchema.validate(message).error;
}

export function isRTCDescriptionMessageModel(
  message: MessageModel | RTCDescriptionMessageModel
): message is RTCDescriptionMessageModel {
  return !rtcDescriptionMessageModelSchema.validate(message).error;
}

export function isRTCCandidateMessageModel(
  message: MessageModel | RTCCandidateMessageModel
): message is RTCCandidateMessageModel {
  return !rtcCandidateMessageModelSchema.validate(message).error;
}

export function isEncryptedMessageModel(
  message: MessageModel | EncryptedMessageModel
): message is EncryptedMessageModel {
  return !encryptedMessageModelSchema.validate(message).error;
}
