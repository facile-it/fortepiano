import { readonlyArray, readonlyRecord, struct as S } from 'fp-ts'
import { pipe, Predicate } from 'fp-ts/function'
import { IntersectionDeep, PartialDeep, ValuesDeep } from '.'
import { curry } from './function'

const toReadonlyArray = <A extends object = never>(
  a: A
): ReadonlyArray<Readonly<[keyof A, A[keyof A]]>> =>
  readonlyRecord.toReadonlyArray(a)

const isObject = <A>(a: A): a is A & object =>
  null !== a && 'object' === typeof a && !Array.isArray(a)

const filterDeep = <A extends object = never>(f: Predicate<ValuesDeep<A>>) => (
  a: A
): PartialDeep<A> =>
  pipe(
    a,
    toReadonlyArray,
    readonlyArray.filter(([_, value]) => (f as Predicate<A[keyof A]>)(value)),
    readonlyArray.map(([key, value]) =>
      isObject(value)
        ? ([
            key,
            pipe(value, filterDeep(f as Predicate<ValuesDeep<typeof value>>)),
          ] as const)
        : ([key, value] as const)
    ),
    readonlyArray.reduce({} as PartialDeep<A>, (b, [key, value]) => ({
      ...b,
      [key]: value,
    }))
  )

const patch = <A extends object, B extends PartialDeep<A> & object>(b: B) => (
  a: A
): IntersectionDeep<A, B> =>
  pipe(
    b,
    toReadonlyArray,
    readonlyArray.map(([key, b]) =>
      isObject(b)
        ? ([key, patch(b)(a[key as keyof A] as A[keyof A] & object)] as const)
        : ([key, b] as const)
    ),
    readonlyArray.reduce({} as IntersectionDeep<A, B>, (ab, [key, b]) => ({
      ...ab,
      [key]: b,
    })),
    curry(S.getAssignSemigroup<IntersectionDeep<A, B>>().concat)(
      a as IntersectionDeep<A, B>
    )
  )

export const struct = {
  ...S,
  toReadonlyArray,
  filterDeep,
  patch,
}
