import type { ProtocolDeployment } from '../chains/types'
import { ZERO_ADDRESS, decodeAddress, poolDeployerOf } from './addresses'
import { OUTCOMES } from './model'
import type { RoleReading } from './model'

/** `factory()` — the role-identifying view shared by the concentrated families. */
export const FACTORY_SELECTOR = '0xc45a0155'

/** Fields whose contract names its own factory, so the role can be read back. */
export const ROLE_FIELDS: ReadonlyArray<string> = ['quoter', 'positionManager']

const REVERT_MESSAGE_RE = /execution reverted|revert|invalid opcode|out of gas|invalid jump/i

/** Whether a JSON-RPC error message describes the call failing to execute. */
export function isRevertMessage(message: string): boolean {
  return REVERT_MESSAGE_RE.test(message)
}

/**
 * Matches a `factory()` answer against the addresses recorded for the same
 * deployment. `eth_call` answers in lowercase and the registry stores EIP-55
 * checksummed values, so both sides are lowercased before comparing.
 *
 * Pass `undefined` when the call produced no answer. An answer that names no
 * contract — a body too short to hold an address, or the zero address — leaves
 * the role unknown. Only an answer naming a different contract is a mismatch.
 */
export function classifyRoleAnswer(
  word: string | undefined,
  deployment: ProtocolDeployment,
): RoleReading {
  if (word === undefined) return { outcome: OUTCOMES.ROLE_UNKNOWN }

  const returned = decodeAddress(word)
  if (returned === undefined) return { outcome: OUTCOMES.ROLE_UNKNOWN }
  if (returned === ZERO_ADDRESS) return { outcome: OUTCOMES.ROLE_UNKNOWN, returned }

  const normalised = returned.toLowerCase()
  if (normalised === deployment.factory.toLowerCase()) {
    return { outcome: OUTCOMES.ROLE_OK, returned }
  }

  const poolDeployer = poolDeployerOf(deployment)?.toLowerCase()
  if (poolDeployer !== undefined && normalised === poolDeployer) {
    return { outcome: OUTCOMES.ROLE_SIBLING, returned }
  }

  return { outcome: OUTCOMES.ROLE_MISMATCH, returned }
}
