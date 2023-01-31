import { AppDispatch } from '..';
import { DeviceActionType, DeviceReducer } from '../actions-types/device';

export const setDevice =
  <Result extends Partial<DeviceReducer>>(
    payload: Result | ((prev: DeviceReducer) => Result)
  ) =>
  (dispatch: AppDispatch) =>
    dispatch({
      type: DeviceActionType.SET,
      payload,
    });

export const resetDevice = () => (dispatch: AppDispatch) =>
  dispatch({
    type: DeviceActionType.RESET,
  });
