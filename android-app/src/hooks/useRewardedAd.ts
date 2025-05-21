import { useEffect, useState } from 'react';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

export default function useRewardedAd() {
  const [rewarded] = useState(() => RewardedAd.createForAdRequest(TestIds.REWARDED));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadListener = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => setLoaded(true));
    const earnListener = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {});
    rewarded.load();
    return () => {
      loadListener();
      earnListener();
    };
  }, [rewarded]);

  return () =>
    new Promise<void>(resolve => {
      if (!loaded) return resolve();
      const earnListener = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => resolve());
      rewarded.show();
      return () => earnListener();
    });
}
