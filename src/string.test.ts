import { capitalize, lowercase, uncapitalize, uppercase } from './string'

describe('string', () => {
  describe('uppercase', () => {
    it('should convert given string to uppercase', () => {
      expect(uppercase('foo bar')).toBe('FOO BAR')
    })
    it('should support empty strings', () => {
      expect(uppercase('')).toBe('')
    })
  })

  describe('lowercase', () => {
    it('should convert given string to lowercase', () => {
      expect(lowercase('FOo BAr')).toBe('foo bar')
    })
    it('should support empty strings', () => {
      expect(lowercase('')).toBe('')
    })
  })

  describe('capitalize', () => {
    it('should capitalize given string', () => {
      expect(capitalize('foo bar')).toBe('Foo bar')
    })
    it('should support empty strings', () => {
      expect(capitalize('')).toBe('')
    })
  })

  describe('uncapitalize', () => {
    it('should uncapitalize given string', () => {
      expect(uncapitalize('FOo BAr')).toBe('fOo BAr')
    })
    it('should support empty strings', () => {
      expect(uncapitalize('')).toBe('')
    })
  })
})
