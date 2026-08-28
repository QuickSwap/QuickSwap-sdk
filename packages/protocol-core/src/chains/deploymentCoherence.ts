import type { ChainConfig, ProtocolDeployment, ProtocolVersion } from './types'

/** Placeholder values rejected wherever a real contract address is required. */
const SENTINEL_ADDRESSES: ReadonlyArray<string> = [
  '0x0000000000000000000000000000000000000000',
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
]

function isSentinel(value: string): boolean {
  const normalised = value.toLowerCase()
  return SENTINEL_ADDRESSES.some((sentinel) => sentinel.toLowerCase() === normalised)
}

/** Pairs every address field of a deployment with its value, narrowed by family. */
function addressEntries(deployment: ProtocolDeployment): ReadonlyArray<readonly [string, string]> {
  switch (deployment.version) {
    case 'v2':
      return [
        ['factory', deployment.factory],
        ['swapRouter', deployment.swapRouter],
      ]
    case 'v3':
    case 'v4':
      return [
        ['factory', deployment.factory],
        ['swapRouter', deployment.swapRouter],
        ['quoter', deployment.quoter],
        ['positionManager', deployment.positionManager],
        ['poolDeployer', deployment.poolDeployer],
      ]
    case 'univ3':
      return [
        ['factory', deployment.factory],
        ['swapRouter', deployment.swapRouter],
        ['quoter', deployment.quoter],
        ['positionManager', deployment.positionManager],
      ]
  }
}

/**
 * Validates one chain's deployment data against the protocol versions it declares.
 *
 * Returns one message per violation, or an empty array when the chain is coherent.
 * Paths in the messages follow the shape used by the address checksum pass.
 */
export function checkDeploymentCoherence(chain: ChainConfig): string[] {
  const errors: string[] = []
  const label = `${chain.name} (${chain.chainId})`

  if (chain.multicall !== undefined && isSentinel(chain.multicall)) {
    errors.push(`${label} multicall is a sentinel address: ${chain.multicall}`)
  }

  if (!chain.deployments) return errors

  const declaredVersions = new Set<ProtocolVersion>(chain.protocols.map((p) => p.version))
  const seenVersions = new Set<ProtocolVersion>()

  chain.deployments.forEach((deployment, index) => {
    const { version } = deployment
    const path = `deployments[${index}]`

    if (!declaredVersions.has(version)) {
      errors.push(`${label} ${path} declares ${version}, which is absent from protocols`)
    }

    if (seenVersions.has(version)) {
      errors.push(`${label} ${path} declares ${version} more than once`)
    }
    seenVersions.add(version)

    for (const [field, value] of addressEntries(deployment)) {
      if (isSentinel(value)) {
        errors.push(`${label} ${path}.${field} is a sentinel address: ${value}`)
      }
    }
  })

  return errors
}
