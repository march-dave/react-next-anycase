import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { GlobalProvider } from './src/context/GlobalContext';
import BannerAdComponent from './src/components/BannerAd';
import InterstitialManager from './src/ads/InterstitialManager';
import PDFViewer from './src/components/PDFViewer';

const todayTask = { text: 'Declutter one drawer' };

export default function App() {
  useEffect(() => {
    InterstitialManager.getInstance();
  }, []);

  return (
    <GlobalProvider todayTask={todayTask}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{todayTask.text}</Text>
        <BannerAdComponent />
        <View style={{ height: 400, width: '100%', marginTop: 20 }}>
          <PDFViewer uri="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" />
        </View>
      </View>
    </GlobalProvider>
  );
}
