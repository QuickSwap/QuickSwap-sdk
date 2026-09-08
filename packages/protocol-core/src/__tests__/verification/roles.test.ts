import { describe, it, expect } from 'vitest'
import type { ProtocolDeployment } from '../../chains/types'
import { OUTCOMES } from '../../verification/model'
import { classifyRoleAnswer, isRevertMessage } from '../../verification/roles'

const FACTORY = '0x411b0fAcC3489691f28ad58c47006AF5E3Ab3A28'
const POOL_DEPLOYER = '0x2D98E2FA9da15aa6dC9581AB097Ced7af697CB92'
const OTHER = '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'

const V3: ProtocolDeployment = {
  version: 'v3',
  factory: FACTORY,
  swapRouter: '0xf5b509bB0909a69B1c207E495f687a596C168E12',
  quoter: '0xa15F0D7377B2A0C0c10db057f641beD21028FC89',
  positionManager: '0x8eF88E4c7CfbbaC1C163f7eddd4B578792201de6',
  poolDeployer: POOL_DEPLOYER,
}

const UNIV3: ProtocolDeployment = {
  version: 'univ3',
  factory: FACTORY,
  swapRouter: '0xf5b509bB0909a69B1c207E495f687a596C168E12',
  quoter: '0xa15F0D7377B2A0C0c10db057f641beD21028FC89',
  positionManager: '0x8eF88E4c7CfbbaC1C163f7eddd4B578792201de6',
}

function wordFor(address: string): string {
  return `0x${'0'.repeat(24)}${address.slice(2).toLowerCase()}`
}

describe('verification/roles', () => {
  describe('isRevertMessage', () => {
    it.each([
      'execution reverted',
      'Execution reverted: STF',
      'invalid opcode',
      'out of gas',
      'invalid jump destination',
    ])('recognises %s', (message) => {
      expect(isRevertMessage(message)).toBe(true)
    })

    it.each(['HTTP 429', 'fetch failed', 'The operation was aborted due to timeout'])(
      'does not recognise %s',
      (message) => {
        expect(isRevertMessage(message)).toBe(false)
      },
    )
  })

  describe('classifyRoleAnswer', () => {
    it('matches the recorded factory', () => {
      expect(classifyRoleAnswer(wordFor(FACTORY), V3)).toEqual({
        outcome: OUTCOMES.ROLE_OK,
        returned: FACTORY.toLowerCase(),
      })
    })

    it('matches the recorded pool deployer', () => {
      expect(classifyRoleAnswer(wordFor(POOL_DEPLOYER), V3)).toEqual({
        outcome: OUTCOMES.ROLE_SIBLING,
        returned: POOL_DEPLOYER.toLowerCase(),
      })
    })

    it('reports a mismatch when the answer names another contract', () => {
      expect(classifyRoleAnswer(wordFor(OTHER), V3)).toEqual({
        outcome: OUTCOMES.ROLE_MISMATCH,
        returned: OTHER.toLowerCase(),
      })
    })

    it('reports a mismatch on a family that declares no pool deployer', () => {
      expect(classifyRoleAnswer(wordFor(POOL_DEPLOYER), UNIV3).outcome).toBe(
        OUTCOMES.ROLE_MISMATCH,
      )
    })

    it('does not accuse an address when the call produced no answer', () => {
      expect(classifyRoleAnswer(undefined, V3)).toEqual({ outcome: OUTCOMES.ROLE_UNKNOWN })
    })

    it('does not accuse an address when the answer is a bare 0x', () => {
      expect(classifyRoleAnswer('0x', V3)).toEqual({ outcome: OUTCOMES.ROLE_UNKNOWN })
    })

    it('does not accuse an address when the answer is too short to hold one', () => {
      expect(classifyRoleAnswer(`0x${'0'.repeat(40)}`, V3)).toEqual({
        outcome: OUTCOMES.ROLE_UNKNOWN,
      })
    })

    it('does not accuse an address when the answer names no contract', () => {
      expect(classifyRoleAnswer(`0x${'0'.repeat(64)}`, V3)).toEqual({
        outcome: OUTCOMES.ROLE_UNKNOWN,
        returned: '0x0000000000000000000000000000000000000000',
      })
    })
  })
})
