import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { GlobalProvider } from './src/context/GlobalContext';
import BannerAdComponent from './src/components/BannerAd';
import InterstitialManager from './src/ads/InterstitialManager';

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
      </View>
    </GlobalProvider>
  );
}
