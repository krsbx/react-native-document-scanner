import _ from 'lodash';
import {
  DeviceActionType,
  DeviceReducer,
  ResetDevice,
  SetDevice,
} from '../actions-types/device';

const initialState: DeviceReducer = {
  initialized: false,
  isHasCamera: false,
  isHasCameraAccess: false,
  isFlashAvailable: false,
  previewHeightPercent: 1,
  previewWidthPercent: 1,
};

const reducer = (
  state = _.cloneDeep(initialState),
  actions: SetDevice | ResetDevice
) => {
  switch (actions.type) {
    case DeviceActionType.SET: {
      if (typeof actions.payload !== 'function') {
        return {
          ...state,
          ...actions.payload,
        };
      }

      return {
        ...state,
        ...actions.payload(state),
      };
    }

    case DeviceActionType.RESET: {
      return _.cloneDeep(state);
    }

    default: {
      return state;
    }
  }
};

export default reducer;
