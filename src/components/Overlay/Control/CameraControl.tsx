import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { DIMENSSIONS } from '../../../utils/constants/global';
import { AppState } from '../../../store';
import { getCameraDisabledStatus } from '../../../store/selectors/scanner';
import TabletLarge from '../../Layout/Control/Tablet/TabletLarge';
import TabletMedium from '../../Layout/Control/Tablet/TabletMedium';
import Phone from '../../Layout/Control/Phone';

const CameraControl: React.FC<Props> = ({ capture, isCameraDisabled }) => {
  const { IS_PHONE } = DIMENSSIONS;
  const disabledStyle = { opacity: isCameraDisabled ? 0.8 : 1 };

  if (!IS_PHONE) {
    if (DIMENSSIONS.HEIGHT < 500)
      return <TabletMedium disabledStyle={disabledStyle} capture={capture} />;

    return <TabletLarge disabledStyle={disabledStyle} capture={capture} />;
  }

  return <Phone disabledStyle={disabledStyle} capture={capture} />;
};

const mapStateToProps = (state: AppState) => ({
  isCameraDisabled: getCameraDisabledStatus(state),
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & {
  capture?: () => void;
};

export default connector(CameraControl);
