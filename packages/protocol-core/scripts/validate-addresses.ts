import { keccak_256 } from '@noble/hashes/sha3'
import { getSupportedChainIds, getChain } from '../src/chains/registry'

function toChecksumAddress(address: string): string {
  const addr = address.toLowerCase().replace('0x', '')
  const hashBytes = keccak_256(new TextEncoder().encode(addr))
  const hash = Array.from(hashBytes).map((b) => b.toString(16).padStart(2, '0')).join('')

  let checksummed = '0x'
  for (let i = 0; i < addr.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      checksummed += addr[i].toUpperCase()
    } else {
      checksummed += addr[i]
    }
  }
  return checksummed
}

function isValidChecksum(address: string): boolean {
  if (!address.startsWith('0x') || address.length !== 42) return false
  return address === toChecksumAddress(address)
}

/** Matches any bare EVM address: 0x followed by exactly 40 hex chars */
const EVM_ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/

/**
 * Recursively walks an object and collects all string values that look like
 * EVM addresses, along with a human-readable path for error messages.
 */
function collectAddresses(
  value: unknown,
  path: string,
  out: Array<{ address: string; path: string }>,
): void {
  if (typeof value === 'string') {
    if (EVM_ADDRESS_RE.test(value)) {
      out.push({ address: value, path })
    }
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => collectAddresses(item, `${path}[${i}]`, out))
    return
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      collectAddresses(child, path ? `${path}.${key}` : key, out)
    }
  }
}

const chainIds = getSupportedChainIds()
let total = 0
const errors: string[] = []

for (const chainId of chainIds) {
  const chain = getChain(chainId)!
  const found: Array<{ address: string; path: string }> = []
  collectAddresses(chain, chain.name, found)

  for (const { address, path } of found) {
    total++
    if (!isValidChecksum(address)) {
      errors.push(
        `${chain.name} (${chainId}) ${path}: ${address} → expected ${toChecksumAddress(address)}`,
      )
    }
  }
}

if (errors.length > 0) {
  console.error(`\n❌ ${errors.length} invalid EIP-55 checksum(s) found:\n`)
  errors.forEach((e) => console.error(`  • ${e}`))
  console.error('')
  process.exit(1)
} else {
  console.log(`✓ ${total} addresses validated across ${chainIds.length} chains`)
  process.exit(0)
}
