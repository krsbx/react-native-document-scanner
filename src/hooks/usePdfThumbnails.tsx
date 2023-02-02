import _ from 'lodash';
import { useState, useEffect } from 'react';
import PdfThumbnail, { ThumbnailResult } from 'react-native-pdf-thumbnail';

const usePdfThumbnails = <
  T extends string | string[],
  U = T extends string
    ? ThumbnailResult | undefined
    : T extends string[]
    ? ThumbnailResult[] | undefined
    : never
>(
  uris: T,
  page: number,
  quality = 80
): U => {
  const [results, setResults] = useState<ThumbnailResult[]>();

  useEffect(() => {
    if (Array.isArray(uris)) {
      Promise.all(
        _.compact(uris).map((uri) => PdfThumbnail.generate(uri, page, quality))
      ).then((values) => setResults(values));

      return;
    }

    if (!_.isEmpty(uris))
      PdfThumbnail.generate(uris, page, quality).then((value) =>
        setResults([value])
      );
  }, [uris]);

  if (Array.isArray(uris)) return results as U;

  return results?.[0] as U;
};

export default usePdfThumbnails;
