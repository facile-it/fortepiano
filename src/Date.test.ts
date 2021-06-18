import * as O from 'fp-ts/Option'
import { fromString, parse } from './Date'

describe('Date', () => {
  describe('fromString', () => {
    it('should fail with invalid date strings', () => {
      expect(fromString('')).toStrictEqual(O.none)
      expect(fromString('foo')).toStrictEqual(O.none)
    })
    it('should succeed with valid date strings', () => {
      expect(fromString('1977-05-25')).toStrictEqual(
        O.some(new Date('1977-05-25')),
      )
    })
  })

  describe('parse', () => {
    it('should fail with invalid date strings', () => {
      expect(parse('')).toStrictEqual(O.none)
      expect(parse('foo')).toStrictEqual(O.none)
    })
    it('should succeed with valid date strings', () => {
      expect(parse('1977-05-25')).toStrictEqual(
        O.some(Date.parse('1977-05-25')),
      )
    })
  })
})
