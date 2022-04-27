import { option } from 'fp-ts'
import * as $date from './Date'

describe('Date', () => {
  describe('fromString', () => {
    it('should fail with invalid date strings', () => {
      expect($date.fromString('')).toStrictEqual(option.none)
      expect($date.fromString('foo')).toStrictEqual(option.none)
    })
    it('should succeed with valid date strings', () => {
      expect($date.fromString('1977-05-25')).toStrictEqual(
        option.some(new Date('1977-05-25')),
      )
    })
  })

  describe('parse', () => {
    it('should fail with invalid date strings', () => {
      expect($date.parse('')).toStrictEqual(option.none)
      expect($date.parse('foo')).toStrictEqual(option.none)
    })
    it('should succeed with valid date strings', () => {
      expect($date.parse('1977-05-25')).toStrictEqual(
        option.some(Date.parse('1977-05-25')),
      )
    })
  })
})
