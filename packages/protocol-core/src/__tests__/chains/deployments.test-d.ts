import { describe, it, expectTypeOf } from 'vitest'
import { getDeployment } from '../../chains/deployments'
import { PROTOCOL_VERSIONS, type V3Deployment, type UniV3Deployment } from '../../chains/types'

describe('The deployment lookup', () => {
  it('narrows its result to the family of the version it was given', () => {
    expectTypeOf(getDeployment(137, PROTOCOL_VERSIONS.V3)).toEqualTypeOf<V3Deployment | undefined>()
    expectTypeOf(getDeployment(169, PROTOCOL_VERSIONS.UNIV3)).toEqualTypeOf<
      UniV3Deployment | undefined
    >()
  })
})
