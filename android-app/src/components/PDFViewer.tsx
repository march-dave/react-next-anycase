import React from 'react';
import { View, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';

export default function PDFViewer({ uri }: { uri: string }) {
  const source = { uri };
  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={source}
        style={{ flex: 1, width: Dimensions.get('window').width }}
      />
    </View>
  );
}
