import Storage from 'expo-sqlite/kv-store';

export const keys = {
  round: 'round.reasoning',
  progress: 'progress',
  lastInterstitialAt: 'ads.lastInterstitialAt',
  adFreeUntil: 'ads.adFreeUntil',
} as const;

type Key = (typeof keys)[keyof typeof keys];

export function readJson<T>(key: Key, fallback: T): T {
  const raw = Storage.getItemSync(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: Key, value: unknown): void {
  Storage.setItemSync(key, JSON.stringify(value));
}

export function removeKey(key: Key): void {
  Storage.removeItemSync(key);
}
