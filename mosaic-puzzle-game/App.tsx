import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import BannerAdComponent from './src/components/BannerAd';
import InterstitialManager from './src/ads/InterstitialManager';

export default function App() {
  useEffect(() => {
    // 최초 한번 전면 광고 로드
    InterstitialManager.getInstance();
  }, []);

  // 버튼 클릭 시 광고를 보여줌
  const showAd = () => InterstitialManager.getInstance().showOnce();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Mosaic Puzzle Game!</Text>
      <Button title="Start" onPress={showAd} />
      <BannerAdComponent />
    </View>
  );
}
