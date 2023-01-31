import {useMemo} from 'react';
import {DIMENSSIONS} from '../utils/constants/global';

const usePreviewSize = ({
  previewHeightPercent,
  previewWidthPercent,
}: {
  previewHeightPercent: number;
  previewWidthPercent: number;
}) => {
  const previewSize = useMemo(() => {
    const heightMargin = ((1 - previewHeightPercent) * DIMENSSIONS.HEIGHT) / 2;
    const widthMargin = ((1 - previewWidthPercent) * DIMENSSIONS.WIDTH) / 2;

    // Portrait
    if (DIMENSSIONS.HEIGHT > DIMENSSIONS.WIDTH) {
      return {
        height: previewHeightPercent,
        width: previewWidthPercent,
        marginTop: heightMargin,
        marginLeft: widthMargin,
      };
    }

    // Landscape
    return {
      width: previewHeightPercent,
      height: previewWidthPercent,
      marginTop: widthMargin,
      marginLeft: heightMargin,
    };
  }, [DIMENSSIONS.SCREEN, previewHeightPercent, previewWidthPercent]);

  return previewSize;
};

export default usePreviewSize;
