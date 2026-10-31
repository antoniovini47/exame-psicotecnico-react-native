import mobileAds, { AdEventType, InterstitialAd, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import { adFreeUntilAfterReward, canShowInterstitial } from '../domain/adPolicy';
import { keys, readJson, writeJson } from '../storage/store';

const PRODUCTION_ADS = process.env.EXPO_PUBLIC_ADS === 'production';

export const bannerAdId = PRODUCTION_ADS ? 'ca-app-pub-9218769381944425/9573093376' : TestIds.ADAPTIVE_BANNER;
const interstitialAdId = PRODUCTION_ADS ? 'ca-app-pub-9218769381944425/2459129925' : TestIds.INTERSTITIAL;
const rewardedAdId = PRODUCTION_ADS ? 'ca-app-pub-9218769381944425/1312959273' : TestIds.REWARDED;

export const adRequest = { keywords: ['habilitacao', 'cnh', 'detran', 'psicotecnico', 'transito', 'exame'] };

const interstitial = InterstitialAd.createForAdRequest(interstitialAdId, adRequest);
const rewarded = RewardedAd.createForAdRequest(rewardedAdId, adRequest);

export function initAds(): void {
  mobileAds()
    .initialize()
    .then(() => {
      interstitial.addAdEventListener(AdEventType.CLOSED, () => interstitial.load());
      interstitial.addAdEventListener(AdEventType.ERROR, () => setTimeout(() => interstitial.load(), 60_000));
      rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => writeJson(keys.adFreeUntil, adFreeUntilAfterReward(Date.now())));
      rewarded.addAdEventListener(AdEventType.CLOSED, () => rewarded.load());
      interstitial.load();
      rewarded.load();
    });
}

export function adFreeUntil(): number | null {
  return readJson<number | null>(keys.adFreeUntil, null);
}

export function maybeShowInterstitial(): void {
  const now = Date.now();
  if (!interstitial.loaded || !canShowInterstitial(readJson<number | null>(keys.lastInterstitialAt, null), adFreeUntil(), now)) return;
  writeJson(keys.lastInterstitialAt, now);
  interstitial.show();
}

export function isRewardedReady(): boolean {
  return rewarded.loaded;
}

export function showRewarded(): void {
  if (rewarded.loaded) rewarded.show();
}
