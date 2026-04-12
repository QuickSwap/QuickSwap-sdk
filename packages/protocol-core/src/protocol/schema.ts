import type { ProtocolVersion, SchemaVariant } from '../chains/types'

const CONCENTRATED_VERSIONS = new Set<ProtocolVersion>(['v3', 'v4', 'univ3'])

export function getSchemaVariant(version: ProtocolVersion): SchemaVariant {
  return CONCENTRATED_VERSIONS.has(version) ? 'concentrated' : 'v2'
}
