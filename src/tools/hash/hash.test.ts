// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { hashText, MAX_INPUT_LENGTH } from './hash'
import type { DigestSource } from './hash'

async function expectHash(input: string, algorithm: Parameters<typeof hashText>[1]): Promise<string> {
  const result = await hashText(input, algorithm)
  if (!result.ok) {
    throw new Error(`Expected success but got error: ${result.error}`)
  }
  return result.value
}

describe('hashText', () => {
  it('matches the SHA-256 test vectors', async () => {
    expect(await expectHash('', 'SHA-256')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
    expect(await expectHash('abc', 'SHA-256')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })

  it('matches the SHA-384 test vector', async () => {
    expect(await expectHash('abc', 'SHA-384')).toBe(
      'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7',
    )
  })

  it('matches the SHA-512 test vector', async () => {
    expect(await expectHash('abc', 'SHA-512')).toBe(
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
    )
  })

  it('produces digests of the expected length', async () => {
    expect(await expectHash('x', 'SHA-256')).toHaveLength(64)
    expect(await expectHash('x', 'SHA-384')).toHaveLength(96)
    expect(await expectHash('x', 'SHA-512')).toHaveLength(128)
  })

  it('hashes the UTF-8 bytes of the input', async () => {
    let captured: number[] = []
    const fake = {
      digest: async (_algorithm: unknown, data: Uint8Array) => {
        captured = Array.from(data)
        return new ArrayBuffer(32)
      },
    } as unknown as DigestSource
    await hashText('\u00e9', 'SHA-256', fake)
    expect(captured).toEqual([0xc3, 0xa9])
  })

  it('reports a clear error when the digest fails', async () => {
    const fake = {
      digest: async () => {
        throw new Error('boom')
      },
    } as unknown as DigestSource
    expect(await hashText('abc', 'SHA-256', fake)).toEqual({ ok: false, error: 'Hashing failed.' })
  })

  it('rejects input above the size limit', async () => {
    const result = await hashText('a'.repeat(MAX_INPUT_LENGTH + 1), 'SHA-256')
    expect(result.ok).toBe(false)
  })
})
