export interface Aggregate<A> {
  isEmpty: (a: A) => boolean
  size: (a: A) => number
}
