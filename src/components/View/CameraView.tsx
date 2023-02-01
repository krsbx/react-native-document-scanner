import React from 'react';
import {
  Animated,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { ScannerView } from 'react-native-rectangle-scanner';
import Icon from 'react-native-vector-icons/Ionicons';

import { AppState } from '../../store';
import { getScanner } from '../../store/selectors/scanner';
import CameraScannerView from './CameraScannerView';
import useCameraMessage from '../../hooks/useCameraMessage';
import { getDevice } from '../../store/selectors/device';

const CameraView: React.FC<Props> = ({
  capture,
  cameraRef,
  flashOpacity,
  scanner,
  device,
  cameraIsOn,
}) => {
  const cameraErorrMessage = useCameraMessage({
    initialized: device.initialized,
    isHasCamera: device.isHasCamera,
    isHasCameraAccess: device.isHasCameraAccess,
    isMultiTasking: scanner.isMultiTasking,
  });

  if (scanner.image) {
    return <></>;
  }

  if (scanner.isOnScannerView) {
    return (
      <CameraScannerView
        capture={capture}
        flashOpacity={flashOpacity}
        cameraIsOn={cameraIsOn}
        cameraRef={cameraRef}
      />
    );
  }

  return (
    <View style={styles.cameraNotAvailableContainer}>
      {scanner.isLoadingCamera ? (
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="white" />
            <Text style={styles.loadingCameraMessage}>Loading Camera</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.cameraNotAvailableText}>{cameraErorrMessage}</Text>
      )}
      <View style={styles.buttonBottomContainer}>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Icon name="ios-close-circle" size={40} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, { marginTop: 8 }]}
            activeOpacity={0.8}
          >
            <Icon
              name="arrow-forward-circle"
              size={40}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  scanner: getScanner(state),
  device: getDevice(state),
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & {
  cameraRef?: React.RefObject<ScannerView>;
  capture?: () => void;
  flashOpacity: Animated.Value;
  cameraIsOn?: boolean;
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
    width: 65,
  },
  buttonBottomContainer: {
    alignItems: 'flex-end',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 25,
    position: 'absolute',
    right: 25,
  },
  buttonGroup: {
    backgroundColor: '#00000080',
    borderRadius: 17,
  },
  buttonIcon: {
    color: 'white',
    fontSize: 22,
    marginBottom: 3,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
  },
  cameraNotAvailableContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  cameraNotAvailableText: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  loadingCameraMessage: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default connector(CameraView);
