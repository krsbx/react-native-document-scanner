import _ from 'lodash';
import React, { useState } from 'react';
import { Button, Image, View, ScrollView } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import usePdfThumbnails from '../../hooks/usePdfThumbnails';

const PdfThumbnail = () => {
  const [uris, setUris] = useState<string[]>([]);
  const thumbnails = usePdfThumbnails(uris, 0, 90);

  const onPress = async () => {
    try {
      const uris = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });

      setUris(uris.map(({ uri }) => uri));
    } catch {}
  };

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
      style={{ flex: 1 }}
    >
      {thumbnails?.map((thumbnail) => (
        <Image source={thumbnail} resizeMode="contain" key={thumbnail.uri} />
      ))}
      <Button onPress={onPress} title="Pick PDF File" />
    </ScrollView>
  );
};

export default PdfThumbnail;
