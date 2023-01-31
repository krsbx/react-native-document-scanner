import {
  DetectedRectangle,
  PictureCallbackProps,
} from 'react-native-rectangle-scanner';
import { AppDispatch } from '..';
import { ScannerReducer, ScannerActionType } from '../actions-types/scanner';

// ---- GLOBAL ---- //

export const setScanner =
  <Result extends Partial<ScannerReducer>>(
    payload: Result | ((prev: ScannerReducer) => Result)
  ) =>
  (dispatch: AppDispatch) =>
    dispatch({
      type: ScannerActionType.SET,
      payload,
    });

export const resetScanner = () => (dispatch: AppDispatch) =>
  dispatch({
    type: ScannerActionType.RESET,
  });

// ---- SELECTOR ---- //

export const setSelectedImage = (payload: number) => (dispatch: AppDispatch) =>
  dispatch({
    type: ScannerActionType.SET_SELECTED_IMAGE,
    payload,
  });

// ---- PUSH ---- //

export const pushImage =
  (payload: PictureCallbackProps) => (dispatch: AppDispatch) =>
    dispatch({
      type: ScannerActionType.PUSH_IMAGE,
      payload,
    });

export const pushDetectedRectangle =
  (payload: DetectedRectangle) => (dispatch: AppDispatch) =>
    dispatch({
      type: ScannerActionType.PUSH_DETECTED_RECTANGLE,
      payload,
    });

// ---- UPDATE ---- //

export const updateImage =
  (index: number, data: PictureCallbackProps) => (dispatch: AppDispatch) =>
    dispatch({
      type: ScannerActionType.UPDATE_IMAGE,
      payload: {
        index,
        data,
      },
    });

export const updateDetectedRectangle =
  (index: number, data: DetectedRectangle) => (dispatch: AppDispatch) =>
    dispatch({
      type: ScannerActionType.UPDATE_DETECTED_RECTANGLE,
      payload: {
        index,
        data,
      },
    });

// ---- DELETE ---- //

export const deleteImage = (payload: number) => (dispatch: AppDispatch) =>
  dispatch({
    type: ScannerActionType.DELETE_IMAGE,
    payload,
  });

export const deleteDetectedRectangle =
  (payload: number) => (dispatch: AppDispatch) =>
    dispatch({
      type: ScannerActionType.DELETE_DETECTED_RECTANGLE,
      payload,
    });
