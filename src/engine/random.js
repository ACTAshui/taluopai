export function assertCryptoSource(rng = globalThis.crypto) {
  if (!rng || typeof rng.getRandomValues !== "function") {
    throw new Error("Web Crypto getRandomValues is required for tarot shuffling.");
  }
}

export function secureRandomInt(maxExclusive, rng = globalThis.crypto) {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error("maxExclusive must be a positive integer.");
  }

  assertCryptoSource(rng);

  const maxUint32 = 0x100000000;
  const limit = maxUint32 - (maxUint32 % maxExclusive);
  const array = new Uint32Array(1);

  while (true) {
    rng.getRandomValues(array);
    const value = array[0];

    if (value < limit) {
      return value % maxExclusive;
    }
  }
}

export function shuffleDeck(deck, rng = globalThis.crypto) {
  const result = [...deck];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1, rng);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function randomOrientation(rng = globalThis.crypto) {
  return secureRandomInt(2, rng) === 0 ? "upright" : "reversed";
}
