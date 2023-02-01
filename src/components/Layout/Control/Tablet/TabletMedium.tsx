import React from 'react';
import { View, TouchableOpacity, Text, ViewProps } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  controlStyle,
  globalStyle,
  overlayStyle,
} from '../../../../utils/styles';
import FlashControl from '../../../Overlay/Control/FlashControl';

const TabletMedium: React.FC<Props> = ({ capture, disabledStyle }) => {
  return (
    <View style={globalStyle.buttonContainer}>
      <View
        style={[
          controlStyle.buttonActionGroup,
          {
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginBottom: 28,
          },
        ]}
      >
        <FlashControl />
        <View style={[controlStyle.buttonGroup, { marginLeft: 8 }]}>
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

export default TabletMedium;
