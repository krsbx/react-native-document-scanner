declare module 'react-native-perspective-image-cropper' {
  import { ComponentClass } from 'react';
  import { View } from 'react-native';
  import { DetectedRectangle } from 'react-native-rectangle-scanner';

  export interface Coordinate {
    x: number;
    y: number;
  }

  export interface CustomCropProps {
    overlayColor?: string;
    overlayOpacity?: number;
    overlayStrokeColor?: string;
    overlayStrokeWidth?: number;

    handlerColor?: string;

    handlerRoundSize?: number;
    handlerRoundOuterSize?: number;

    topOffset?: number;
    bottomOffset?: number;

    height: number;
    path?: string;
    rectangleCoordinates?: DetectedRectangle;
    initialImage: string;
    updateImage: (path: string, coordinates: DetectedRectangle) => void;
    width: number;
  }

  export interface CustomCropView extends ComponentClass<CustomCropProps> {
    crop: () => void;
  }

  const CustomCrop: ComponentClass<CustomCropProps>;

  export default CustomCrop;
}
