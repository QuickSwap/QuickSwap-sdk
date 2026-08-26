import type { ProtocolVersion, DeploymentFor } from './types'
import { getChain } from './registry'

/**
 * Returns the contract deployment a chain declares for one protocol version,
 * or `undefined` when the chain, the `deployments` list, or the entry is absent.
 *
 * The result narrows from the `version` argument, so a caller passing a literal
 * version reaches exactly the fields that family deploys.
 */
export function getDeployment<V extends ProtocolVersion>(
  chainId: number,
  version: V,
): DeploymentFor<V> | undefined {
  return getChain(chainId)?.deployments?.find((d): d is DeploymentFor<V> => d.version === version)
}
