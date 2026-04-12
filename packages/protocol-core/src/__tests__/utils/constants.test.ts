import { describe, it, expect } from 'vitest'
import { SUBGRAPH_PAGE_SIZE, MIN_PRICE_USD, MIN_VOLUME_USD } from '../../utils/constants'

describe('utils/constants', () => {
  it('SUBGRAPH_PAGE_SIZE is 1000', () => {
    expect(SUBGRAPH_PAGE_SIZE).toBe(1000)
  })

  it('MIN_PRICE_USD is 0.000001', () => {
    expect(MIN_PRICE_USD).toBe(0.000001)
  })

  it('MIN_VOLUME_USD is 0.0001', () => {
    expect(MIN_VOLUME_USD).toBe(0.0001)
  })
})
