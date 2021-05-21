import * as O from 'fp-ts/Option'
import { toBoolean } from './Option'

describe('Option', () => {
  describe('toBoolean', () => {
    it('should convert an Option to a boolean', () => {
      expect(toBoolean(O.none)).toBe(false)
      expect(toBoolean(O.some(null))).toBe(true)
    })
  })
})
