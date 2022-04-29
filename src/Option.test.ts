import { option } from 'fp-ts'
import * as $option from './Option'

describe('Option', () => {
  describe('toBoolean', () => {
    it('should convert an Option to a boolean', () => {
      expect($option.toBoolean(option.none)).toBe(false)
      expect($option.toBoolean(option.some(null))).toBe(true)
    })
  })
})
