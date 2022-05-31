declare const HasURI: unique symbol
export interface Has<A> {
  readonly URI: typeof HasURI
  readonly [K: symbol]: A
}

declare const TagURI: unique symbol
export interface Tag<A> {
  readonly [TagURI]: A
  readonly key: symbol
}

export const tag = <A>(): Tag<A> => ({ key: Symbol() } as Tag<A>)

export const singleton = <A>(tag: Tag<A>, a: A): Has<A> =>
  ({ [tag.key]: a } as Has<A>)

export const lookup =
  <A>(tag: Tag<A>) =>
  (has: Has<A>) =>
    has[tag.key]

export const upsertAt =
  <B>(tag: Tag<B>, b: B) =>
  <_Has extends Has<unknown>>(has: _Has): _Has & Has<B> => ({
    ...has,
    ...singleton(tag, b),
  })

export const modifyAt =
  <B>(tag: Tag<B>, f: (b: B) => B) =>
  <_Has extends Has<B>>(has: _Has) =>
    upsertAt(tag, f(lookup(tag)(has)))(has)
