import { Predicate } from 'fp-ts/function';
import { IntersectionDeep, PartialDeep } from '.';
export declare type struct = object;
export declare const toReadonlyArray: <A extends object>(a: A) => readonly (readonly [keyof A, A[keyof A]])[];
export declare const lookup: <S extends object, K extends keyof S>(k: K) => (s: S) => S[K];
export declare const modifyAt: <S extends object, K extends keyof S>(k: K, f: (a: S[K]) => S[K]) => (s: S) => S;
export declare const updateAt: <S extends object, K extends keyof S>(k: K, a: S[K]) => (s: S) => S;
export declare const filterDeep: <A extends object>(f: Predicate<unknown>) => (a: A) => PartialDeep<A>;
export declare const patch: <A extends object, B extends PartialDeep<A> & object>(b: B) => (a: A) => IntersectionDeep<A, B>;
