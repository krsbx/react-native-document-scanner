import _ from 'lodash';
import { Dimensions } from 'react-native';

export const DIMENSSIONS = {
  SCREEN: Dimensions.get('screen'),
  get HEIGHT() {
    return this.SCREEN.height;
  },
  get WIDTH() {
    return this.SCREEN.width;
  },
  get SCALE() {
    return this.SCREEN.scale;
  },
  get FONT_SCALE() {
    return this.SCREEN.fontScale;
  },
  get ASPECT_RATIO() {
    return this.HEIGHT / this.WIDTH;
  },
  get IS_PHONE() {
    return this.ASPECT_RATIO > 1.6;
  },
};
