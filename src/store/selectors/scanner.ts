import { AppState } from '..';

export const getScanner = (state: AppState) => state.scanner;

export const getSelectedImageIndex = (state: AppState) =>
  getScanner(state).selectedImage;

export const getLoadStatus = (state: AppState) =>
  getScanner(state).didLoadInitialLayout;

export const getFlashStatus = (state: AppState) =>
  getScanner(state).isFlashEnabled;

export const getCameraStatus = (state: AppState) =>
  getScanner(state).isLoadingCamera;

export const getScannerViewStatus = (state: AppState) =>
  getScanner(state).isOnScannerView;

export const getMultiTaskingStatus = (state: AppState) =>
  getScanner(state).isMultiTasking;

export const getImageProcessStatus = (state: AppState) =>
  getScanner(state).isProcessingImage;

export const getScannerStatus = (state: AppState) =>
  getScanner(state).isTakingPicture;

export const getStoredImages = (state: AppState) => getScanner(state).images;

export const getStoredDetectedRectangles = (state: AppState) =>
  getScanner(state).detectedRectangles;

export const getCameraDisabledStatus = (state: AppState) => {
  const { isTakingPicture, isProcessingImage } = getScanner(state);

  return isTakingPicture || isProcessingImage;
};
