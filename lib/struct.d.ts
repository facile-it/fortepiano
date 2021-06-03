import { Predicate } from 'fp-ts/function';
import * as Sh from 'fp-ts/Show';
import { IntersectionDeep, PartialDeep } from '.';
export declare type struct = object;
export declare const Show: Sh.Show<struct>;
export declare const toReadonlyArray: <A extends object>(a: A) => readonly (readonly [keyof A, A[keyof A]])[];
export declare const filterDeep: <A extends object>(f: Predicate<unknown>) => (a: A) => PartialDeep<A>;
export declare const patch: <A extends object, B extends PartialDeep<A> & object>(b: B) => (a: A) => IntersectionDeep<A, B>;
