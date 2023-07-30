import {
  ActionModel,
  TransferModel,
  TransferUpdateModel,
} from '../types/Models';
import { ActionType } from '../types/ActionType';

export function addTransferAction(transfer: TransferModel): ActionModel {
  return {
    type: ActionType.ADD_TRANSFER,
    value: transfer,
  };
}

export function updateTransferAction(
  transferUpdate: TransferUpdateModel
): ActionModel {
  return {
    type: ActionType.UPDATE_TRANSFER,
    value: transferUpdate,
  };
}

export function removeTransferAction(transferId: string): ActionModel {
  return {
    type: ActionType.REMOVE_TRANSFER,
    value: transferId,
  };
}

export function acceptTransferAction(transferId: string): ActionModel {
  return {
    type: ActionType.ACCEPT_TRANSFER,
    value: transferId,
  };
}

export function rejectTransferAction(transferId: string): ActionModel {
  return {
    type: ActionType.REJECT_TRANSFER,
    value: transferId,
  };
}

export function cancelTransferAction(transferId: string): ActionModel {
  return {
    type: ActionType.CANCEL_TRANSFER,
    value: transferId,
  };
}

export function createTransferAction(
  file: File,
  clientId: string
): ActionModel {
  return {
    type: ActionType.CREATE_TRANSFER,
    value: {
      file,
      clientId,
    },
  };
}

export function addIceCandidateAction(
  transferId: string,
  data: any
): ActionModel {
  return {
    type: ActionType.ADD_ICE_CANDIDATE,
    value: {
      transferId,
      data,
    },
  };
}

export function setLocalDescriptionAction(
  transferId: string,
  data: any
): ActionModel {
  return {
    type: ActionType.SET_LOCAL_DESCRIPTION,
    value: {
      transferId,
      data,
    },
  };
}

export function setRemoteDescriptionAction(
  transferId: string,
  data: any
): ActionModel {
  return {
    type: ActionType.SET_REMOTE_DESCRIPTION,
    value: {
      transferId,
      data,
    },
  };
}
