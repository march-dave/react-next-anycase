import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

type Props = {
  adUnitId?: string;
  size?: BannerAdSize;
};

export default function BannerAdComponent({ adUnitId = TestIds.BANNER, size = BannerAdSize.BANNER }: Props) {
  return (
    <View style={{ alignItems: 'center' }}>
      <BannerAd unitId={adUnitId} size={size} />
    </View>
  );
}
