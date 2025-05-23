import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

type Props = {
  adUnitId?: string;
  size?: BannerAdSize;
};

export default function BannerAdComponent({ adUnitId = TestIds.BANNER, size = BannerAdSize.BANNER }: Props) {
  // 배너 광고 컴포넌트
  return (
    <View style={{ alignItems: 'center' }}>
      <BannerAd unitId={adUnitId} size={size} />
    </View>
  );
}
