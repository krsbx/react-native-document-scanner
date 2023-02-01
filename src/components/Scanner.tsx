import React, { createRef, useEffect, useRef } from 'react';
import {
  LayoutChangeEvent,
  StatusBar,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { ScannerView } from 'react-native-rectangle-scanner';

import { AppState } from '../store';
import { setScanner as _setScanner } from '../store/actions/scanner';
import { setDevice as _setDevice } from '../store/actions/device';
import CameraView from './View/CameraView';
import { getScanner } from '../store/selectors/scanner';
import { DIMENSSIONS } from '../utils/constants/global';
import { getDevice } from '../store/selectors/device';
import useSnapAnimation from '../hooks/useSnapAnimation';
import useCameraPermission from '../hooks/permissions/useCameraPermission';
import useEffectOnce from '../hooks/useEffectOnce';

const Scanner: React.FC<Props> = ({
  scanner,
  setScanner,
  device,
  setDevice,
  cameraIsOn,
}) => {
  const {
    didLoadInitialLayout,
    isMultiTasking,
    isTakingPicture,
    isProcessingImage,
    detectedRectangle,
    isOnScannerView,
  } = scanner;

  const { flashOpacity, startSnapAnimation } = useSnapAnimation();
  const { requestCameraPermissions } = useCameraPermission();

  const cameraRef = createRef<ScannerView>();
  const imageProcessingTimeout = useRef<ReturnType<typeof setTimeout>>();

  const capture = () => {
    if (isTakingPicture || isProcessingImage || !detectedRectangle) return;

    setScanner({
      isTakingPicture: true,
      isProcessingImage: true,
    });

    cameraRef.current?.capture?.();
    startSnapAnimation();

    imageProcessingTimeout.current = setTimeout(() => {
      if (!isTakingPicture) return;

      setScanner({
        isTakingPicture: false,
      });
    }, 100);
  };

  const turnOnCamera = () => {
    if (isOnScannerView) return;

    setScanner({
      isLoadingCamera: true,
      isOnScannerView: true,
    });
  };

  const turnOffCamera = (shouldUninitializeCamera = false) => {
    if (shouldUninitializeCamera && device.initialized) {
      setScanner({
        isOnScannerView: false,
      });
      setDevice({
        initialized: false,
      });
    } else if (isOnScannerView) {
      setScanner({
        isOnScannerView: false,
      });
    }
  };

  const onLayout = (event: LayoutChangeEvent) => {
    // This is used to detect multi tasking mode on iOS/iPad
    // Camera use is not allowed
    if (didLoadInitialLayout && Platform.OS === 'ios') {
      const screenWidth = DIMENSSIONS.WIDTH;
      const isMultiTasking =
        Math.round(event.nativeEvent.layout.width) < Math.round(screenWidth);

      setScanner({
        isMultiTasking,
        isLoadingCamera: false,
      });

      return;
    }

    setScanner({
      didLoadInitialLayout: true,
    });
  };

  useEffectOnce(requestCameraPermissions);

  useEffect(() => {
    if (!didLoadInitialLayout || isMultiTasking) return;

    turnOnCamera();

    return () => {
      if (!imageProcessingTimeout.current) return;

      clearTimeout(imageProcessingTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!didLoadInitialLayout) return;
    if (isMultiTasking) return turnOffCamera(true);
    if (device.initialized && (!device.isHasCamera || device.isHasCameraAccess))
      return turnOffCamera();

    if (cameraIsOn === true && !isOnScannerView) return turnOnCamera();
    if (cameraIsOn === false && isOnScannerView) return turnOffCamera(true);
    if (cameraIsOn === undefined) return turnOnCamera();
  }, [didLoadInitialLayout]);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <StatusBar
        backgroundColor="black"
        barStyle="light-content"
        hidden={Platform.OS !== 'android'}
      />
      <CameraView
        flashOpacity={flashOpacity}
        cameraIsOn={cameraIsOn}
        cameraRef={cameraRef}
        capture={capture}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  device: getDevice(state),
  scanner: getScanner(state),
});

const connector = connect(mapStateToProps, {
  setScanner: _setScanner,
  setDevice: _setDevice,
});

type Props = ConnectedProps<typeof connector> & {
  cameraIsOn?: boolean;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
});

export default connector(Scanner);
