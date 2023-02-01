import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { overlayStyle } from '../../../utils/styles';

const ProcessingImage = () => {
  return (
    <View style={overlayStyle.container}>
      <View style={overlayStyle.loadingContainer}>
        <View style={overlayStyle.processingContainer}>
          <ActivityIndicator color="#333333" size="large" />
          <Text style={overlayStyle.processingMessage}>Processing</Text>
        </View>
      </View>
    </View>
  );
};

export default ProcessingImage;
