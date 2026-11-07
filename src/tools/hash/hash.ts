export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512'

export const HASH_ALGORITHMS: readonly HashAlgorithm[] = ['SHA-256', 'SHA-384', 'SHA-512']

export type HashResult = { ok: true; value: string } | { ok: false; error: string }

export type DigestSource = Pick<SubtleCrypto, 'digest'>

export const MAX_INPUT_LENGTH = 5_000_000

export async function hashText(input: string, algorithm: HashAlgorithm, subtle?: DigestSource): Promise<HashResult> {
  if (input.length > MAX_INPUT_LENGTH) {
    return { ok: false, error: `Input is too large (maximum ${MAX_INPUT_LENGTH.toLocaleString('en-US')} characters).` }
  }

  const digestSource: DigestSource | undefined = subtle ?? globalThis.crypto?.subtle
  if (!digestSource) {
    return { ok: false, error: 'The Web Crypto API is not available. A secure (HTTPS) context is required.' }
  }

  try {
    const data = new TextEncoder().encode(input)
    const digest = await digestSource.digest(algorithm, data)
    const value = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
    return { ok: true, value }
  } catch {
    return { ok: false, error: 'Hashing failed.' }
  }
}
