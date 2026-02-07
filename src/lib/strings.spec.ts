import { describe, it, expect } from 'vitest'
import { commonPrefix } from './strings'

describe('commonPrefix', () => {
  it('finds common prefix', () => {
    expect(commonPrefix(['abc', 'ab', 'a'])).toBe('a')
    expect(commonPrefix(['abc', 'ab', ''])).toBe('')
  })
})
