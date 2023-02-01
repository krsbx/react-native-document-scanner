import React from 'react';
import { Animated, View } from 'react-native';
import Scanner, {
  RectangleOverlay,
  ScannerComponentProps,
  ScannerView,
} from 'react-native-rectangle-scanner';
import { connect, ConnectedProps } from 'react-redux';

import { AppState } from '../../store';
import { setScanner as _setScanner } from '../../store/actions/scanner';
import { setDevice as _setDevice } from '../../store/actions/device';
import usePreviewSize from '../../hooks/usePreviewSize';
import CameraOverlay from '../Overlay/CameraOverlay';
import {
  getStoredDetectedRectangles,
  getSelectedImageIndex,
  getScanner,
} from '../../store/selectors/scanner';
import { getDevice } from '../../store/selectors/device';
import { overlayStyle } from '../../utils/styles';

const CameraScannerView: React.FC<Props> = ({
  cameraRef,
  detectedRectangle,
  capture,
  setScanner,
  setDevice,
  cameraIsOn,
  flashOpacity,
  scanner,
  device,
}) => {
  const onDeviceSetup: ScannerComponentProps['onDeviceSetup'] = ({
    flashIsAvailable,
    hasCamera,
    permissionToUseCamera,
    previewHeightPercent,
    previewWidthPercent,
  }) => {
    setScanner({
      isLoadingCamera: false,
    });

    setDevice({
      initialized: true,
      isHasCamera: hasCamera,
      isHasCameraAccess: permissionToUseCamera,
      isFlashAvailable: flashIsAvailable,
      previewHeightPercent: previewHeightPercent || 1,
      previewWidthPercent: previewWidthPercent || 1,
    });
  };

  const onPictureTaken: ScannerComponentProps['onPictureTaken'] = (event) => {
    setScanner({
      isTakingPicture: false,
    });
  };

  const onPictureProcessed: ScannerComponentProps['onPictureProcessed'] = (
    event
  ) => {
    setScanner({
      image: event,
      isTakingPicture: false,
      isProcessingImage: false,
      isOnScannerView: cameraIsOn || false,
    });
  };

  const onRectangleDetected: ScannerComponentProps['onRectangleDetected'] = ({
    detectedRectangle,
  }) => {
    setScanner({
      detectedRectangle,
    });
  };

  const previewSize = usePreviewSize({
    previewHeightPercent: device.previewHeightPercent,
    previewWidthPercent: device.previewWidthPercent,
  });

  return (
    <View
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        position: 'relative',
        marginTop: previewSize.marginTop,
        marginLeft: previewSize.marginLeft,
        height: `${previewSize.height * 100}%`,
        width: `${previewSize.width * 100}%`,
      }}
    >
      <Scanner
        enableTorch={scanner.isFlashEnabled}
        ref={cameraRef}
        capturedQuality={1}
        onTorchChanged={({ enabled }) =>
          setScanner({ isFlashEnabled: enabled })
        }
        style={overlayStyle.scanner}
        onDeviceSetup={onDeviceSetup}
        onPictureProcessed={onPictureProcessed}
        onPictureTaken={onPictureTaken}
        onRectangleDetected={onRectangleDetected}
      />
      {!scanner.isLoadingCamera && !scanner.isProcessingImage ? (
        <RectangleOverlay
          detectedRectangle={detectedRectangle}
          // previewRatio={previewSize}
          backgroundColor="rgba(255,181,6, 0.2)"
          borderColor="rgb(255,181,6)"
          borderWidth={4}
          // == These let you auto capture and change the overlay style on detection ==
          detectedBackgroundColor="rgba(255,181,6, 0.3)"
          detectedBorderWidth={6}
          detectedBorderColor="rgb(255,218,124)"
          onDetectedCapture={capture}
          allowDetection
        /> //Change view style 'top' according to the need if overlay is not matching the corners of the document. See https://github.com/HarvestProfit/react-native-rectangle-scanner/issues/22.}
      ) : null}
      <Animated.View
        style={[
          overlayStyle.container,
          {
            backgroundColor: 'white',
            opacity: flashOpacity,
          },
        ]}
      />
      <CameraOverlay capture={capture} />
    </View>
  );
};
const mapStateToProps = (state: AppState) => {
  const selectedImage = getSelectedImageIndex(state);
  const detectedRectangles = getStoredDetectedRectangles(state);

  return {
    detectedRectangle: detectedRectangles[selectedImage],
    scanner: getScanner(state),
    device: getDevice(state),
  };
};

const connector = connect(mapStateToProps, {
  setScanner: _setScanner,
  setDevice: _setDevice,
});

type Props = ConnectedProps<typeof connector> &
  Pick<
    ScannerComponentProps,
    | 'onPictureTaken'
    | 'onPictureProcessed'
    | 'onRectangleDetected'
    | 'onDeviceSetup'
  > & {
    cameraRef?: React.RefObject<ScannerView>;
    capture?: () => void;
    flashOpacity: Animated.Value;
    cameraIsOn?: boolean;
  };

export default connector(CameraScannerView);
