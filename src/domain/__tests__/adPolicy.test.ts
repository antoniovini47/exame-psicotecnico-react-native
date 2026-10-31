import { describe, expect, it } from '@jest/globals';
import { adFreeUntilAfterReward, canShowInterstitial, INTERSTITIAL_MIN_GAP_MS } from '../adPolicy';

describe('canShowInterstitial', () => {
  it('given no ad shown yet, when checking, then allows it', () => {
    expect(canShowInterstitial(null, null, 0)).toBe(true);
  });

  it('given an ad shown less than 3 minutes ago, when checking, then blocks it', () => {
    expect(canShowInterstitial(0, null, INTERSTITIAL_MIN_GAP_MS - 1)).toBe(false);
  });

  it('given an ad shown 3 minutes ago, when checking, then allows it', () => {
    expect(canShowInterstitial(0, null, INTERSTITIAL_MIN_GAP_MS)).toBe(true);
  });

  it('given an active reward, when checking, then blocks it until the reward ends', () => {
    const until = adFreeUntilAfterReward(0);
    expect(canShowInterstitial(null, until, until - 1)).toBe(false);
    expect(canShowInterstitial(null, until, until)).toBe(true);
  });
});
