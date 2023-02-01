import React from 'react';
import { View, TouchableOpacity, Text, ViewProps } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  controlStyle,
  globalStyle,
  overlayStyle,
} from '../../../../utils/styles';
import FlashControl from '../../../Overlay/Control/FlashControl';

const TabletLarge: React.FC<Props> = ({ capture, disabledStyle }) => {
  return (
    <View style={globalStyle.buttonContainer}>
      <View
        style={[
          controlStyle.buttonActionGroup,
          { justifyContent: 'flex-end', marginBottom: 20 },
        ]}
      >
        <FlashControl />
      </View>
      <View style={[overlayStyle.cameraOutline, disabledStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={overlayStyle.cameraButton}
          onPress={capture}
        />
      </View>
      <View style={[controlStyle.buttonActionGroup, { marginTop: 28 }]}>
        <View style={controlStyle.buttonGroup}>
          <TouchableOpacity
            style={[controlStyle.button, disabledStyle]}
            activeOpacity={0.8}
          >
            <Icon
              name="arrow-forward-circle"
              size={40}
              color="white"
              style={controlStyle.buttonIcon}
            />
            <Text style={controlStyle.buttonText}>Skip</Text>
          </TouchableOpacity>
        </View>
        <View style={controlStyle.buttonGroup}>
          <TouchableOpacity style={controlStyle.button} activeOpacity={0.8}>
            <Icon
              name="ios-close-circle"
              size={40}
              style={controlStyle.buttonIcon}
            />
            <Text style={controlStyle.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

type Props = {
  disabledStyle: ViewProps['style'];
  capture?: () => void;
};

export default TabletLarge;
