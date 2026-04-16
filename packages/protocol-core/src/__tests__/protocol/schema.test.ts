import { describe, it, expect } from 'vitest'
import { getSchemaVariant } from '../../protocol/schema'

describe('protocol/schema', () => {
  it('maps v3 to concentrated', () => {
    expect(getSchemaVariant('v3')).toBe('concentrated')
  })

  it('maps v4 to concentrated', () => {
    expect(getSchemaVariant('v4')).toBe('concentrated')
  })

  it('maps univ3 to concentrated', () => {
    expect(getSchemaVariant('univ3')).toBe('concentrated')
  })

  it('maps v2 to v2', () => {
    expect(getSchemaVariant('v2')).toBe('v2')
  })
})
