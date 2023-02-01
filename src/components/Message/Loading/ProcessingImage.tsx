import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const ProcessingImage = () => {
  return (
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
};

const styles = StyleSheet.create({
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
});

export default ProcessingImage;
