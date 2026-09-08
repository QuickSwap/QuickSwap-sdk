import { PROTOCOL_VERSIONS } from '../chains/types'
import type { ChainConfig, ProtocolDeployment } from '../chains/types'
import type { AddressTarget, MalformedAddress } from './model'

export const EVM_ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const ABI_WORD_HEX_LENGTH = 64
const ADDRESS_HEX_LENGTH = 40
const PADDING_HEX_LENGTH = ABI_WORD_HEX_LENGTH - ADDRESS_HEX_LENGTH
const PADDING_ZEROS = '0'.repeat(PADDING_HEX_LENGTH)
const HEX_BODY_RE = /^[0-9a-fA-F]+$/

/**
 * Reads the address out of a 32-byte ABI word. The word must be exactly one
 * word wide and its leading 12 bytes must be zero, so a value that is not an
 * address yields nothing instead of its low 20 bytes.
 */
export function decodeAddress(word: string): string | undefined {
  const body = word.startsWith('0x') ? word.slice(2) : word
  if (body.length !== ABI_WORD_HEX_LENGTH) return undefined
  if (!HEX_BODY_RE.test(body)) return undefined
  if (body.slice(0, PADDING_HEX_LENGTH) !== PADDING_ZEROS) return undefined
  return `0x${body.slice(PADDING_HEX_LENGTH)}`
}

/** The pool deployer, on the families that declare one. */
export function poolDeployerOf(deployment: ProtocolDeployment): string | undefined {
  return 'poolDeployer' in deployment ? deployment.poolDeployer : undefined
}

const PROTOCOL_VERSION_VALUES: ReadonlyArray<string> = Object.values(PROTOCOL_VERSIONS)

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : undefined
}

function isProtocolDeployment(value: unknown): value is ProtocolDeployment {
  const record = asRecord(value)
  if (record === undefined) return false
  return (
    typeof record.version === 'string' &&
    PROTOCOL_VERSION_VALUES.includes(record.version) &&
    typeof record.factory === 'string'
  )
}

/** The symbol of a token entry, used to name it in a path. */
function symbolOf(value: unknown): string | undefined {
  const record = asRecord(value)
  if (record === undefined) return undefined
  return typeof record.symbol === 'string' && typeof record.address === 'string'
    ? record.symbol
    : undefined
}

function memberKey(item: unknown, index: number): string {
  if (isProtocolDeployment(item)) return item.version
  return symbolOf(item) ?? String(index)
}

function leafOf(path: string): string {
  const segments = path.split('.')
  return segments[segments.length - 1].replace(/\[[^\]]*\]$/, '')
}

export interface CollectedAddresses {
  readonly targets: ReadonlyArray<AddressTarget>
  readonly malformed: ReadonlyArray<MalformedAddress>
}

function walk(
  value: unknown,
  path: string,
  deployment: ProtocolDeployment | undefined,
  targets: AddressTarget[],
  malformed: MalformedAddress[],
): void {
  if (typeof value === 'string') {
    if (!value.startsWith('0x')) return
    if (EVM_ADDRESS_RE.test(value)) {
      targets.push({ path, field: leafOf(path), address: value, deployment })
    } else {
      malformed.push({ path, value })
    }
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      walk(
        item,
        `${path}[${memberKey(item, index)}]`,
        isProtocolDeployment(item) ? item : deployment,
        targets,
        malformed,
      )
    })
    return
  }

  const record = asRecord(value)
  if (record === undefined) return

  for (const [key, child] of Object.entries(record)) {
    walk(child, path === '' ? key : `${path}.${key}`, deployment, targets, malformed)
  }
}

/**
 * Every address a chain records, in the order the registry declares them, plus
 * the values that are shaped like an address without being one.
 */
export function collectTargets(chain: ChainConfig): CollectedAddresses {
  const targets: AddressTarget[] = []
  const malformed: MalformedAddress[] = []
  walk(chain, '', undefined, targets, malformed)
  return { targets, malformed }
}
