import * as S from 'fp-ts/string'

export const uppercase = <S extends string>(s: S): Uppercase<S> =>
  s.toUpperCase() as Uppercase<S>

export const lowercase = <S extends string>(s: S): Lowercase<S> =>
  s.toLowerCase() as Lowercase<S>

export const capitalize = <S extends string>(s: S): Capitalize<S> =>
  (S.isEmpty(s) ? s : s[0].toUpperCase() + s.slice(1)) as Capitalize<S>

export const uncapitalize = <S extends string>(s: S): Uncapitalize<S> =>
  (S.isEmpty(s) ? s : s[0].toLowerCase() + s.slice(1)) as Uncapitalize<S>

export const test = (re: RegExp) => (s: string) => re.test(s)
