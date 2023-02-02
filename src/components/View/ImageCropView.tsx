import React, { useEffect, useRef, useState, Component } from 'react';
import RNFS from 'react-native-fs';
import { Button, Image, ScrollView } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import CustomCrop, {
  CustomCropProps,
  CustomCropView,
} from 'react-native-perspective-image-cropper';
import { DetectedRectangle } from 'react-native-rectangle-scanner';
import usePdfThumbnails from '../../hooks/usePdfThumbnails';
import { DIMENSSIONS } from '../../utils/constants/global';

const ImageCropView = () => {
  const [uri, setUri] = useState<string>();
  const [image, setImage] = useState<string>();
  const [initialImage, setInitialImage] = useState<string>();
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [rectangleCoordinates, setRectangleCoordinates] =
    useState<DetectedRectangle>({
      topLeft: { x: DIMENSSIONS.WIDTH * 0.2, y: DIMENSSIONS.HEIGHT * 0.2 },
      topRight: { x: DIMENSSIONS.WIDTH * 0.8, y: DIMENSSIONS.HEIGHT * 0.2 },
      bottomRight: { x: DIMENSSIONS.WIDTH * 0.8, y: DIMENSSIONS.HEIGHT * 0.8 },
      bottomLeft: { x: DIMENSSIONS.WIDTH * 0.2, y: DIMENSSIONS.HEIGHT * 0.8 },
      dimensions: dimensions,
    });
  const thumbnail = usePdfThumbnails(uri ?? '', 0, 90);
  const cropRef = useRef<CustomCropView>();

  useEffect(() => {
    if (!thumbnail?.uri) return;

    Image.getSize(thumbnail?.uri, (width, height) =>
      setDimensions({ width, height })
    );

    // setDimensions({
    //   width: thumbnail.width,
    //   height: thumbnail.height,
    // });

    RNFS.readFile(thumbnail.uri, 'base64').then((value) =>
      setInitialImage(value)
    );
  }, [thumbnail]);

  const onPress = async () => {
    try {
      const { uri } = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, 'image/jpg', 'image/jpeg'],
      });

      setUri(uri);
    } catch {}
  };

  const updateImage = (image: string, newCoordinates: DetectedRectangle) => {
    setImage(image);
    setRectangleCoordinates(newCoordinates);
  };

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
      style={{ flex: 1 }}
    >
      {uri ? (
        <React.Fragment>
          {initialImage && dimensions.width && dimensions.height ? (
            <CustomCrop
              updateImage={updateImage}
              rectangleCoordinates={rectangleCoordinates}
              initialImage={`data:image/png;base64,${initialImage}`}
              height={dimensions.height}
              width={dimensions.width}
              overlayStrokeWidth={1}
              overlayColor="rgba(18,190,210, 0.4)"
              overlayStrokeColor="rgba(20,180,255, 1)"
              handlerColor="rgba(20,150,160, 1)"
              handlerRoundSize={15}
              handlerRoundOuterSize={0.5}
              topOffset={20}
              bottomOffset={20}
              ref={
                cropRef as unknown as React.RefObject<
                  Component<CustomCropProps>
                >
              }
            />
          ) : null}
          {/* <Image source={thumbnail} resizeMode="contain" key={thumbnail.uri} /> */}
        </React.Fragment>
      ) : null}
      <Button onPress={onPress} title="Pick PDF File" />
    </ScrollView>
  );
};

export default ImageCropView;
