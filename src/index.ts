export type PartialDeep<A> = A extends { readonly [x: string]: unknown }
  ? Partial<{ readonly [K in keyof A]: PartialDeep<A[K]> }>
  : A

export type ValuesDeep<A> = A extends { readonly [x: string]: unknown } & {
  readonly [K in keyof A]: unknown
}
  ? A[keyof A] | ValuesDeep<A[keyof A]>
  : A

export type IntersectionDeep<A, B> = A extends { readonly [x: string]: unknown }
  ? A &
      {
        readonly [K in keyof B]: IntersectionDeep<
          K extends keyof A ? A[K] : unknown,
          B[K]
        >
      }
  : B
