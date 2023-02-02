import React, { useState, useRef, Component } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import CustomCrop, {
  CustomCropProps,
  CustomCropView,
} from 'react-native-perspective-image-cropper';
import { DetectedRectangle } from 'react-native-rectangle-scanner';
import { connect, ConnectedProps } from 'react-redux';

import { AppState } from '../../store';
import { getScanner } from '../../store/selectors/scanner';

const CropView: React.FC<Props> = ({ scanner }) => {
  const [initialImage, setInitialImage] = useState(
    scanner.image?.initialImage!
  );
  const [height] = useState(scanner.detectedRectangle?.dimensions.height!);
  const [width] = useState(scanner.detectedRectangle?.dimensions.width!);
  const [croppedImage, setCroppedImage] = useState<string>();
  const [rectangleCoordinates, setRectangleCoordinates] =
    useState<DetectedRectangle>(scanner.detectedRectangle!);
  const cropRef = useRef<CustomCropView>();

  const updateImage = (image: string, newCoordinates: DetectedRectangle) => {
    setRectangleCoordinates(newCoordinates);
    setCroppedImage(image);
  };

  const onPressUndo = () => setCroppedImage(undefined);

  const onPressDone = () => {
    console.log(croppedImage);
  };

  const onPressCrop = () => cropRef.current?.crop?.();

  return (
    <View style={styles.container}>
      {!croppedImage ? (
        <CustomCrop
          updateImage={updateImage}
          rectangleCoordinates={rectangleCoordinates}
          initialImage={initialImage}
          height={height}
          width={width}
          overlayStrokeWidth={1}
          overlayColor="rgba(18,190,210, 0.4)"
          overlayStrokeColor="rgba(20,180,255, 1)"
          handlerColor="rgba(20,150,160, 1)"
          handlerRoundSize={15}
          handlerRoundOuterSize={0.5}
          topOffset={10}
          bottomOffset={10}
          ref={
            cropRef as unknown as React.RefObject<Component<CustomCropProps>>
          }
        />
      ) : (
        <Image
          style={styles.croppedImage}
          source={{ uri: `data:image/png;base64,${croppedImage}` }}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          disabled={croppedImage ? false : true}
          style={[
            styles.button,
            { backgroundColor: croppedImage ? '#fefefe' : '#ebecf0' },
          ]}
          onPress={onPressUndo}
        >
          <Text style={[styles.buttonText]}>UNDO</Text>
        </TouchableOpacity>
        {croppedImage ? (
          <TouchableOpacity style={[styles.button]} onPress={onPressDone}>
            <Text style={[styles.buttonText]}>DONE</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button]} onPress={onPressCrop}>
            <Text style={[styles.buttonText]}>CROP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  scanner: getScanner(state),
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector>;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    bottom: 10,
  },
  croppedImage: {
    height: '40%',
    width: '100%',
    resizeMode: 'contain',
    transform: [{ rotate: '-90deg' }],
  },
  button: {
    backgroundColor: '#fefefe',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: 150,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default connector(CropView);
