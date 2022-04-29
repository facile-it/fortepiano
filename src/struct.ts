import { readonlyArray, readonlyRecord, struct as _struct } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { Predicate } from 'fp-ts/Predicate'
import { IntersectionDeep, PartialDeep } from '.'
import { curry } from './function'
import * as $type from './Type'

// eslint-disable-next-line @typescript-eslint/ban-types
export type Struct = object

export const toReadonlyArray = <A extends Struct>(
  a: A,
): ReadonlyArray<Readonly<[keyof A, A[keyof A]]>> =>
  readonlyRecord.toReadonlyArray(a)

export const lookup =
  <S extends Struct, K extends keyof S>(k: K) =>
  (s: S): S[K] =>
    s[k]

export const modifyAt =
  <S extends Struct, K extends keyof S>(k: K, f: (a: S[K]) => S[K]) =>
  (s: S): S => ({ ...s, [k]: f(s[k]) })

export const updateAt = <S extends Struct, K extends keyof S>(k: K, a: S[K]) =>
  modifyAt(k, () => a)

export const filterDeep =
  <A extends Struct>(f: Predicate<unknown /*ValuesDeep<A>*/>) =>
  (a: A): PartialDeep<A> =>
    pipe(
      a,
      toReadonlyArray,
      readonlyArray.filter(([_, value]) => (f as Predicate<A[keyof A]>)(value)),
      readonlyArray.map(([key, value]) =>
        $type.struct.is(value)
          ? ([
              key,
              pipe(
                value,
                filterDeep(
                  f as Predicate<unknown /*ValuesDeep<typeof value>*/>,
                ),
              ),
            ] as const)
          : ([key, value] as const),
      ),
      readonlyArray.reduce({} as PartialDeep<A>, (b, [key, value]) => ({
        ...b,
        [key]: value,
      })),
    )

export const patch =
  <A extends Struct, B extends PartialDeep<A> & Struct>(b: B) =>
  (a: A): IntersectionDeep<A, B> =>
    pipe(
      b,
      toReadonlyArray,
      readonlyArray.map(([key, b]) =>
        $type.struct.is(b)
          ? ([key, patch(b)(a[key as keyof A] as A[keyof A] & Struct)] as const)
          : ([key, b] as const),
      ),
      readonlyArray.reduce({} as IntersectionDeep<A, B>, (ab, [key, b]) => ({
        ...ab,
        [key]: b,
      })),
      curry(_struct.getAssignSemigroup<IntersectionDeep<A, B>>().concat)(
        a as IntersectionDeep<A, B>,
      ),
    )
