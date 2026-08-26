import { describe, it, expect } from 'vitest'
import { getDeployment } from '../../chains/deployments'
import { PROTOCOL_VERSIONS } from '../../chains/types'

const ETHEREUM_ID = 1
const UNREGISTERED_ID = 99999

describe('The deployment lookup', () => {
  describe('when no entry can satisfy the request', () => {
    it('finds nothing on an unregistered chain', () => {
      const deployment = getDeployment(UNREGISTERED_ID, PROTOCOL_VERSIONS.V3)

      expect(deployment).toBeUndefined()
    })

    it('finds nothing on a chain that declares no deployments', () => {
      const deployment = getDeployment(ETHEREUM_ID, PROTOCOL_VERSIONS.V3)

      expect(deployment).toBeUndefined()
    })

    it.each(Object.values(PROTOCOL_VERSIONS))(
      'finds no %s entry on a chain that declares no deployments',
      (version) => {
        const deployment = getDeployment(ETHEREUM_ID, version)

        expect(deployment).toBeUndefined()
      },
    )
  })
})
