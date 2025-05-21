import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

class InterstitialManager {
  private static instance: InterstitialManager;
  private interstitial: InterstitialAd;
  private shown = false;

  private constructor() {
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
    if (!this.shown) {
      this.interstitial.show();
      this.shown = true;
    }
  }
}

export default InterstitialManager;
