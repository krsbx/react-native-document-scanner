import {
  DetectedRectangle,
  PictureCallbackProps,
} from 'react-native-rectangle-scanner';

export type ScannerReducer = {
  image: PictureCallbackProps | undefined;
  isFlashEnabled: boolean;
  didLoadInitialLayout: boolean;
  detectedRectangle: DetectedRectangle | undefined;
  isMultiTasking: boolean;
  isLoadingCamera: boolean;
  isProcessingImage: boolean;
  isTakingPicture: boolean;
  isOnScannerView: boolean;

  images: PictureCallbackProps[];
  detectedRectangles: DetectedRectangle[];
  selectedImage: number;
};

export enum ScannerActionType {
  SET = 'scanner.set',
  RESET = 'scanner.reset',

  SET_SELECTED_IMAGE = 'scanner.selected-image.set',

  PUSH_IMAGE = 'scanner.image.push',
  PUSH_DETECTED_RECTANGLE = 'scanner.detected-rectangle.push',

  UPDATE_IMAGE = 'scanner.image.update',
  UPDATE_DETECTED_RECTANGLE = 'scanner.detected-rectangle.update',

  DELETE_IMAGE = 'scanner.image.delete',
  DELETE_DETECTED_RECTANGLE = 'scanner.detected-rectangle.delete',
}

// ---- GLOBAL ---- //

export type SetScanner = {
  type: ScannerActionType.SET;
  payload:
    | Partial<ScannerReducer>
    | ((prev: ScannerReducer) => Partial<ScannerReducer>);
};

export type DeleteScanner = {
  type: ScannerActionType.RESET;
};

// ---- SELECTOR ---- //

export type SetSelectedImage = {
  type: ScannerActionType.SET_SELECTED_IMAGE;
  payload: number;
};

// ---- PUSH ---- //

export type PushImage = {
  type: ScannerActionType.PUSH_IMAGE;
  payload: PictureCallbackProps;
};

export type PushDetectedRectangle = {
  type: ScannerActionType.PUSH_DETECTED_RECTANGLE;
  payload: DetectedRectangle;
};

// ---- UPDATE ---- //

export type UpdateImage = {
  type: ScannerActionType.UPDATE_IMAGE;
  payload: {
    index: number;
    data: PictureCallbackProps;
  };
};

export type UpdateDetectedRectangle = {
  type: ScannerActionType.UPDATE_DETECTED_RECTANGLE;
  payload: {
    index: number;
    data: DetectedRectangle;
  };
};

// ---- DELETE ---- //

export type DeleteImage = {
  type: ScannerActionType.DELETE_IMAGE;
  payload: number;
};

export type DeleteDetectedRectangle = {
  type: ScannerActionType.DELETE_DETECTED_RECTANGLE;
  payload: number;
};
