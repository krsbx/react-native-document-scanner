import _ from 'lodash';
import React, {
  createRef,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Scanner, {
  DetectedRectangle,
  PictureCallbackProps,
  RectangleOverlay,
  ScannerComponentProps,
  ScannerView,
} from 'react-native-rectangle-scanner';
import Icon from 'react-native-vector-icons/Ionicons';

import useCameraPermission from '../hooks/permissions/useCameraPermission';
import usePreviewSize from '../hooks/usePreviewSize';
import useSnapAnimation from '../hooks/useSnapAnimation';
import { DIMENSSIONS } from '../utils/constants/global';

const DocScanner: React.FC<Props> = ({ cameraIsOn }) => {
  const [image, setImage] = useState<PictureCallbackProps>();
  const [isFlashEnabled, setIsFlashEnabled] = useState(false);
  const [didLoadInitialLayout, setDidLoadInitialLayout] = useState(false);
  const [isOnScannerView, setIsOnScannerView] = useState(false);
  const [detectedRectangle, setDetectedRectangle] =
    useState<DetectedRectangle>();
  const [isMultiTasking, setIsMultiTasking] = useState(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [device, setDevice] = useState({
    initialized: false,
    isHasCamera: false,
    isHasCameraAccess: false,
    flashIsAvailable: false,
    previewHeightPercent: 1,
    previewWidthPercent: 1,
  });

  const { flashOpacity, startSnapAnimation } = useSnapAnimation();
  const { requestCameraPermissions } = useCameraPermission();

  const cameraRef = createRef<ScannerView>();
  const imageProcessingTimeout = useRef<ReturnType<typeof setTimeout>>();

  const getCameraDisabledMessage = () => {
    if (isMultiTasking) {
      return 'Camera is not allowed in multi tasking mode.';
    }

    if (device.initialized) {
      if (!device.isHasCamera) {
        return 'Could not find a camera on the device.';
      }
      if (!device.isHasCameraAccess) {
        return 'Permission to use camera has not been granted.';
      }
    }
    return 'Failed to set up the camera.';
  };

  const getPreviewSize = useCallback(() => {
    // We use set margin amounts because for some reasons the percentage values don't align the camera preview in the center correctly.
    const heightMargin =
      ((1 - device.previewHeightPercent) * DIMENSSIONS.HEIGHT) / 2;
    const widthMargin =
      ((1 - device.previewWidthPercent) * DIMENSSIONS.WIDTH) / 2;
    if (DIMENSSIONS.HEIGHT > DIMENSSIONS.WIDTH) {
      // Portrait
      return {
        height: device.previewHeightPercent,
        width: device.previewWidthPercent,
        marginTop: heightMargin,
        marginLeft: widthMargin,
      };
    }

    // Landscape
    return {
      width: device.previewHeightPercent,
      height: device.previewWidthPercent,
      marginTop: widthMargin,
      marginLeft: heightMargin,
    };
  }, []);

  const onDeviceSetup: ScannerComponentProps['onDeviceSetup'] = ({
    flashIsAvailable,
    hasCamera,
    permissionToUseCamera,
    previewHeightPercent,
    previewWidthPercent,
  }) => {
    setIsLoadingCamera(false);
    setDevice({
      initialized: true,
      isHasCamera: hasCamera,
      isHasCameraAccess: permissionToUseCamera,
      flashIsAvailable,
      previewHeightPercent: previewHeightPercent || 1,
      previewWidthPercent: previewWidthPercent || 1,
    });
  };

  const capture = () => {
    if (isTakingPicture || isProcessingImage || !detectedRectangle) return;

    setIsTakingPicture(true);
    setIsProcessingImage(true);
    cameraRef.current?.capture?.();
    startSnapAnimation();

    imageProcessingTimeout.current = setTimeout(() => {
      if (!isTakingPicture) return;

      setIsTakingPicture(false);
    }, 100);
  };

  const onPictureTaken: ScannerComponentProps['onPictureTaken'] = (event) => {
    setIsTakingPicture(false);
  };

  const onPictureProcessed: ScannerComponentProps['onPictureProcessed'] = (
    event
  ) => {
    setImage(event);
    setIsTakingPicture(false);
    setIsProcessingImage(false);
    setIsOnScannerView(cameraIsOn || false);
  };

  const turnOnCamera = () => {
    if (isOnScannerView) return;

    setIsOnScannerView(true);
    setIsLoadingCamera(true);
  };

  const turnOffCamera = (shouldUninitializeCamera = false) => {
    if (shouldUninitializeCamera && device.initialized) {
      setIsOnScannerView(false);
      setDevice((device) => ({
        ...device,
        initialized: false,
      }));
    } else if (isOnScannerView) {
      setIsOnScannerView(false);
    }
  };

  useEffect(() => {
    requestCameraPermissions();
  }, []);

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

  const renderFlashControl = () => {
    // if (!device.flashIsAvailable) return null;
    return (
      <TouchableOpacity
        style={[
          styles.flashControl,
          { backgroundColor: isFlashEnabled ? '#FFFFFF80' : '#00000080' },
        ]}
        activeOpacity={0.8}
        onPress={() => setIsFlashEnabled((prev) => !prev)}
      >
        <Icon
          name="ios-flashlight"
          style={[
            styles.buttonIcon,
            { fontSize: 28, color: isFlashEnabled ? '#333' : '#FFF' },
          ]}
        />
      </TouchableOpacity>
    );
  };

  const renderCameraControls = () => {
    const aspectRatio = DIMENSSIONS.ASPECT_RATIO;
    const isPhone = aspectRatio > 1.6;
    const cameraIsDisabled = isTakingPicture || isProcessingImage;
    const disabledStyle = { opacity: cameraIsDisabled ? 0.8 : 1 };
    if (!isPhone) {
      if (DIMENSSIONS.HEIGHT < 500) {
        return (
          <View style={styles.buttonContainer}>
            <View
              style={[
                styles.buttonActionGroup,
                {
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  marginBottom: 28,
                },
              ]}
            >
              {renderFlashControl()}
              <View style={[styles.buttonGroup, { marginLeft: 8 }]}>
                <TouchableOpacity
                  style={[styles.button, disabledStyle]}
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
            <View style={[styles.cameraOutline, disabledStyle]}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cameraButton}
                onPress={capture}
              />
            </View>
            <View style={[styles.buttonActionGroup, { marginTop: 28 }]}>
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.button} activeOpacity={0.8}>
                  <Icon
                    name="ios-close-circle"
                    size={40}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }
      return (
        <View style={styles.buttonContainer}>
          <View
            style={[
              styles.buttonActionGroup,
              { justifyContent: 'flex-end', marginBottom: 20 },
            ]}
          >
            {renderFlashControl()}
          </View>
          <View style={[styles.cameraOutline, disabledStyle]}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cameraButton}
              onPress={capture}
            />
          </View>
          <View style={[styles.buttonActionGroup, { marginTop: 28 }]}>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, disabledStyle]}
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
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.button} activeOpacity={0.8}>
                <Icon
                  name="ios-close-circle"
                  size={40}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <>
        <View style={styles.buttonBottomContainer}>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} activeOpacity={0.8}>
              <Icon
                name="ios-close-circle"
                size={40}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.cameraOutline, disabledStyle]}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cameraButton}
              onPress={capture}
            />
          </View>
          <View>
            <View
              style={[
                styles.buttonActionGroup,
                {
                  justifyContent: 'flex-end',
                  marginBottom: 16,
                },
              ]}
            >
              {renderFlashControl()}
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, disabledStyle]}
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
      </>
    );
  };

  const renderCameraOverlay = () => {
    let loadingState = null;
    if (isLoadingCamera) {
      loadingState = (
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="white" />
            <Text style={styles.loadingCameraMessage}>Loading Camera</Text>
          </View>
        </View>
      );
    } else if (isProcessingImage) {
      loadingState = (
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <View style={styles.processingContainer}>
              <ActivityIndicator color="#333333" size="large" />
              <Text style={{ color: '#333333', fontSize: 30, marginTop: 10 }}>
                Processing
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <>
        {loadingState}
        <SafeAreaView style={[styles.overlay]}>
          {renderCameraControls()}
        </SafeAreaView>
      </>
    );
  };

  const renderCameraView = () => {
    if (isOnScannerView) {
      const previewSize = getPreviewSize();
      let rectangleOverlay = null;
      if (!isLoadingCamera && !isProcessingImage) {
        rectangleOverlay = (
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
          /> //Change view style 'top' according to the need if overlay is not matching the corners of the document. See https://github.com/HarvestProfit/react-native-rectangle-scanner/issues/22.
        );
      }

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
            onPictureTaken={onPictureTaken}
            onPictureProcessed={onPictureProcessed}
            enableTorch={isFlashEnabled}
            ref={cameraRef}
            capturedQuality={1}
            onRectangleDetected={({ detectedRectangle }) =>
              setDetectedRectangle(detectedRectangle)
            }
            onDeviceSetup={onDeviceSetup}
            onTorchChanged={({ enabled }) => setIsFlashEnabled(enabled)}
            style={styles.scanner}
          />
          {rectangleOverlay}
          <Animated.View
            style={{
              ...styles.overlay,
              backgroundColor: 'white',
              opacity: flashOpacity,
            }}
          />
          {renderCameraOverlay()}
        </View>
      );
    }

    let message = null;
    if (isLoadingCamera) {
      message = (
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="white" />
            <Text style={styles.loadingCameraMessage}>Loading Camera</Text>
          </View>
        </View>
      );
    } else {
      message = (
        <Text style={styles.cameraNotAvailableText}>
          {getCameraDisabledMessage()}
        </Text>
      );
    }

    return (
      <View style={styles.cameraNotAvailableContainer}>
        {message}
        <View style={styles.buttonBottomContainer}>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} activeOpacity={0.8}>
              <Icon
                name="ios-close-circle"
                size={40}
                style={styles.buttonIcon}
              />
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

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        // This is used to detect multi tasking mode on iOS/iPad
        // Camera use is not allowed
        if (didLoadInitialLayout && Platform.OS === 'ios') {
          const screenWidth = DIMENSSIONS.WIDTH;
          const isMultiTasking =
            Math.round(event.nativeEvent.layout.width) <
            Math.round(screenWidth);
          if (isMultiTasking) {
            setIsMultiTasking(true);
            setIsLoadingCamera(false);
          } else {
            setIsMultiTasking(false);
          }
        } else {
          setDidLoadInitialLayout(true);
        }
      }}
    >
      <StatusBar
        backgroundColor="black"
        barStyle="light-content"
        hidden={Platform.OS !== 'android'}
      />
      {renderCameraView()}
    </View>
  );
};

type Props = {
  cameraIsOn?: boolean;
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
    width: 65,
  },
  buttonActionGroup: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  buttonContainer: {
    alignItems: 'flex-end',
    bottom: 25,
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 25,
    top: 25,
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
  buttonTopContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 25,
    position: 'absolute',
    right: 25,
    top: 40,
  },
  cameraButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    flex: 1,
    margin: 3,
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
  cameraOutline: {
    borderColor: 'white',
    borderRadius: 50,
    borderWidth: 3,
    height: 70,
    width: 70,
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  flashControl: {
    alignItems: 'center',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    margin: 8,
    paddingTop: 7,
    width: 50,
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
  processingContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(220, 220, 220, 0.7)',
    borderRadius: 16,
    height: 140,
    justifyContent: 'center',
    width: 200,
  },
  scanner: {
    flex: 1,
  },
});

export default DocScanner;
