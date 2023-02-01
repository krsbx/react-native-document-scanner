import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import { AppState } from '../../store';
import {
  getCameraStatus,
  getImageProcessStatus,
} from '../../store/selectors/scanner';
import LoadingCamera from '../Message/Loading/LoadingCamera';
import ProcessingImage from '../Message/Loading/ProcessingImage';
import CameraControl from './Control/CameraControl';

const CameraOverlay: React.FC<Props> = ({
  capture,
  isLoadingCamera,
  isProcessingImage,
}) => {
  return (
    <React.Fragment>
      {!isLoadingCamera ? null : isProcessingImage ? (
        <ProcessingImage />
      ) : (
        <LoadingCamera />
      )}
      <SafeAreaView style={[styles.overlay]}>
        <CameraControl capture={capture} />
      </SafeAreaView>
    </React.Fragment>
  );
};

const mapStateToProps = (state: AppState) => ({
  isLoadingCamera: getCameraStatus(state),
  isProcessingImage: getImageProcessStatus(state),
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & {
  capture?: () => void;
};

const styles = StyleSheet.create({
  overlay: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default connector(CameraOverlay);
