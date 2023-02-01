import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { overlayStyle } from '../../../utils/styles';

const LoadingCamera = () => {
  return (
    <View style={overlayStyle.container}>
      <View style={overlayStyle.loadingContainer}>
        <ActivityIndicator color="white" />
        <Text style={overlayStyle.loadingCameraMessage}>Loading Camera</Text>
      </View>
    </View>
  );
};

export default LoadingCamera;
