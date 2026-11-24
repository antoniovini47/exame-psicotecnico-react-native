import { describe, expect, it } from '@jest/globals';
import { REVIEW_MIN_GAP_MS, REVIEW_MIN_SHARE, shouldAskReview } from '../reviewPrompt';

describe('shouldAskReview', () => {
  it('given a good score and never asked, when checking, then asks', () => {
    expect(shouldAskReview(REVIEW_MIN_SHARE, null, 0)).toBe(true);
  });

  it('given a score below the bar, when checking, then does not ask', () => {
    expect(shouldAskReview(REVIEW_MIN_SHARE - 0.01, null, 0)).toBe(false);
  });

  it('given an ask less than 90 days ago, when checking, then does not ask', () => {
    expect(shouldAskReview(1, 0, REVIEW_MIN_GAP_MS - 1)).toBe(false);
  });

  it('given an ask 90 days ago, when checking, then asks again', () => {
    expect(shouldAskReview(1, 0, REVIEW_MIN_GAP_MS)).toBe(true);
  });
});
