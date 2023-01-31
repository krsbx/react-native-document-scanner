import {PermissionsAndroid} from 'react-native';
import LANG from '../../utils/constants/lang';

const useCameraPermission = (lang: 'en' | 'id' = 'en') => {
  const requestCameraPermissions = () =>
    PermissionsAndroid.request('android.permission.CAMERA', {
      title: LANG[lang].CAMERA_PERMISSIONS.title,
      message: LANG[lang].CAMERA_PERMISSIONS.message,
      buttonNeutral: LANG[lang].CAMERA_PERMISSIONS.buttonNeutral,
      buttonNegative: LANG[lang].CAMERA_PERMISSIONS.buttonNegative,
      buttonPositive: LANG[lang].CAMERA_PERMISSIONS.buttonPositive,
    });

  return {
    requestCameraPermissions,
  };
};

export default useCameraPermission;
