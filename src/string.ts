import { string } from 'fp-ts'

export const uppercase = <S extends string>(s: S): Uppercase<S> =>
  s.toUpperCase() as Uppercase<S>

export const lowercase = <S extends string>(s: S): Lowercase<S> =>
  s.toLowerCase() as Lowercase<S>

export const capitalize = <S extends string>(s: S): Capitalize<S> =>
  (string.isEmpty(s) ? s : s[0].toUpperCase() + s.slice(1)) as Capitalize<S>

export const uncapitalize = <S extends string>(s: S): Uncapitalize<S> =>
  (string.isEmpty(s) ? s : s[0].toLowerCase() + s.slice(1)) as Uncapitalize<S>

export const test = (re: RegExp) => (s: string) => re.test(s)
