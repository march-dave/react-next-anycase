import { InterstitialAd, TestIds } from 'react-native-google-mobile-ads';

class InterstitialManager {
  private static instance: InterstitialManager;
  private interstitial: InterstitialAd;
  private shown = false;

  private constructor() {
    // 테스트용 전면 광고 로드
    this.interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);
    this.interstitial.load();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new InterstitialManager();
    }
    return this.instance;
  }

  showOnce() {
    // 한 번만 전면 광고 노출
    if (!this.shown) {
      this.interstitial.show();
      this.shown = true;
    }
  }
}

export default InterstitialManager;
