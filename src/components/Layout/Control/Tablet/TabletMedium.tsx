import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import Icon from 'react-native-vector-icons/Ionicons';

import FlashControl from '../../../Overlay/Control/FlashControl';

const TabletMedium: React.FC<Props> = ({ capture, disabledStyle }) => {
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
        <FlashControl />
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
            <Icon name="ios-close-circle" size={40} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
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

type Props = {
  disabledStyle: ViewProps['style'];
  capture?: () => void;
};

export default TabletMedium;
