export type DeviceReducer = {
  initialized: boolean;
  isHasCamera: boolean;
  isHasCameraAccess: boolean;
  isFlashAvailable: boolean;
  previewHeightPercent: number;
  previewWidthPercent: number;
};

export enum DeviceActionType {
  SET = 'device.set',
  RESET = 'device.reset',
}

export type SetDevice = {
  type: DeviceActionType.SET;
  payload:
    | Partial<DeviceReducer>
    | ((prev: DeviceReducer) => Partial<DeviceReducer>);
};

export type ResetDevice = {
  type: DeviceActionType.RESET;
};
