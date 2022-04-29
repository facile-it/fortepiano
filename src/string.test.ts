import * as $string from './string'

describe('string', () => {
  describe('uppercase', () => {
    it('should convert given string to uppercase', () => {
      expect($string.uppercase('foo bar')).toBe('FOO BAR')
    })
    it('should support empty strings', () => {
      expect($string.uppercase('')).toBe('')
    })
  })

  describe('lowercase', () => {
    it('should convert given string to lowercase', () => {
      expect($string.lowercase('FOo BAr')).toBe('foo bar')
    })
    it('should support empty strings', () => {
      expect($string.lowercase('')).toBe('')
    })
  })

  describe('capitalize', () => {
    it('should capitalize given string', () => {
      expect($string.capitalize('foo bar')).toBe('Foo bar')
    })
    it('should support empty strings', () => {
      expect($string.capitalize('')).toBe('')
    })
  })

  describe('uncapitalize', () => {
    it('should uncapitalize given string', () => {
      expect($string.uncapitalize('FOo BAr')).toBe('fOo BAr')
    })
    it('should support empty strings', () => {
      expect($string.uncapitalize('')).toBe('')
    })
  })
})
