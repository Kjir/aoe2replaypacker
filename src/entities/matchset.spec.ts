import { describe, it, expect } from 'vitest'
import { MatchSetDefinition, MatchSetType } from './matchset'

describe('MatchSetDefinition', () => {
  it('correctly parses correct definition', () => {
    const setDefinition = MatchSetDefinition.parse('bo3')
    expect(setDefinition.length).toBe(3)
    expect(setDefinition.type).toBe(MatchSetType.BestOf)
  })

  it('throws error on invalid set type', () => {
    expect(() => MatchSetDefinition.parse('xx3')).toThrowError(/^Invalid set/)
  })

  it('throws error on invalid set length', () => {
    expect(() => MatchSetDefinition.parse('boXX')).toThrowError(/^Invalid set/)
  })
})
