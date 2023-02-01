import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect, ConnectedProps } from 'react-redux';

import { AppState } from '../../../store';
import { setScanner as _setScanner } from '../../../store/actions/scanner';
import { getFlashStatus } from '../../../store/selectors/scanner';

const FlashControl: React.FC<Props> = ({ isFlashEnabled, setScanner }) => {
  return (
    <TouchableOpacity
      style={[
        styles.flashControl,
        { backgroundColor: isFlashEnabled ? '#FFFFFF80' : '#00000080' },
      ]}
      activeOpacity={0.8}
      onPress={() =>
        setScanner((prev) => ({ isFlashEnabled: !prev.isFlashEnabled }))
      }
    >
      <Icon
        name="ios-flashlight"
        style={[
          styles.buttonIcon,
          { fontSize: 28, color: isFlashEnabled ? '#333' : '#FFF' },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flashControl: {
    alignItems: 'center',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    margin: 8,
    paddingTop: 7,
    width: 50,
  },
  buttonIcon: {
    color: 'white',
    fontSize: 22,
    marginBottom: 3,
    textAlign: 'center',
  },
});

const mapStateToProps = (state: AppState) => ({
  isFlashEnabled: getFlashStatus(state),
});

const connector = connect(mapStateToProps, {
  setScanner: _setScanner,
});

type Props = ConnectedProps<typeof connector>;

export default connector(FlashControl);
