import _ from 'lodash';
import {
  ScannerReducer,
  DeleteDetectedRectangle,
  DeleteImage,
  DeleteScanner,
  PushDetectedRectangle,
  PushImage,
  ScannerActionType,
  SetScanner,
  SetSelectedImage,
  UpdateDetectedRectangle,
  UpdateImage,
} from '../actions-types/scanner';

const initialState: ScannerReducer = {
  detectedRectangle: undefined,
  detectedRectangles: [],
  didLoadInitialLayout: false,
  image: undefined,
  images: [],
  isFlashEnabled: false,
  isLoadingCamera: false,
  isMultiTasking: false,
  isProcessingImage: false,
  isTakingPicture: false,
  isOnScannerView: false,
  selectedImage: -1, // -1 = No selected
};

const reducer = (
  state = _.cloneDeep(initialState),
  actions:
    | DeleteDetectedRectangle
    | DeleteImage
    | DeleteScanner
    | PushDetectedRectangle
    | PushImage
    | SetScanner
    | SetSelectedImage
    | UpdateDetectedRectangle
    | UpdateImage
): ScannerReducer => {
  switch (actions.type) {
    // ---- GLOBAL ---- //

    case ScannerActionType.SET: {
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

    case ScannerActionType.RESET: {
      return _.cloneDeep(initialState);
    }

    // ---- SELECTOR ---- //

    case ScannerActionType.SET_SELECTED_IMAGE: {
      return {
        ...state,
        selectedImage: actions.payload,
      };
    }

    // ---- PUSH ---- //

    case ScannerActionType.PUSH_IMAGE: {
      state.images.push(actions.payload);

      return state;
    }

    case ScannerActionType.PUSH_DETECTED_RECTANGLE: {
      state.detectedRectangles.push(actions.payload);

      return state;
    }

    // ---- UPDATE ---- //

    case ScannerActionType.UPDATE_IMAGE: {
      if (!state.images[actions.payload.index]) return state;

      state.images[actions.payload.index] = actions.payload.data;

      return state;
    }

    case ScannerActionType.UPDATE_DETECTED_RECTANGLE: {
      if (!state.detectedRectangles[actions.payload.index]) return state;

      state.detectedRectangles[actions.payload.index] = actions.payload.data;

      return state;
    }

    // ---- DELETE ---- //

    case ScannerActionType.DELETE_IMAGE: {
      if (!state.images[actions.payload]) return state;

      state.images.splice(actions.payload, 1);

      return state;
    }

    case ScannerActionType.DELETE_DETECTED_RECTANGLE: {
      if (!state.detectedRectangles[actions.payload]) return state;

      state.detectedRectangles.splice(actions.payload, 1);

      return state;
    }

    default: {
      return state;
    }
  }
};

export default reducer;
