import * as Appli from 'fp-ts/Applicative';
import * as _Apply from 'fp-ts/Apply';
import * as C from 'fp-ts/Chain';
import * as FIO from 'fp-ts/FromIO';
import * as F from 'fp-ts/Functor';
import * as IO from 'fp-ts/IO';
import * as M from 'fp-ts/Monad';
import * as MIO from 'fp-ts/MonadIO';
import * as P from 'fp-ts/Pointed';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as RR from 'fp-ts/ReadonlyRecord';
import { PartialDeep } from '.';
export declare const URI = "Mock";
export declare type URI = typeof URI;
declare module 'fp-ts/HKT' {
    interface URItoKind<A> {
        readonly [URI]: Mock<A>;
    }
}
declare type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R;
export interface Mock<A> {
    (...as: ReadonlyArray<PartialDeep<A>>): IO.IO<A>;
}
export declare const Functor: F.Functor1<URI>;
export declare const map: <A, B>(a: (a: A) => B) => (b: Mock<A>) => Mock<B>;
export declare const flap: <A>(a: A) => <B>(fab: Mock<(a: A) => B>) => Mock<B>;
export declare const bindTo: <N extends string>(name: N) => <A>(fa: Mock<A>) => Mock<{ readonly [K in N]: A; }>;
export declare const Pointed: P.Pointed1<URI>;
export declare const of: <A>(a: A) => Mock<A>;
export declare const Do: Mock<{}>;
export declare const Apply: _Apply.Apply1<URI>;
export declare const ap: <A, B>(a: Mock<A>) => (b: Mock<(a: A) => B>) => Mock<B>;
export declare const apFirst: <B>(second: Mock<B>) => <A>(first: Mock<A>) => Mock<A>;
export declare const apSecond: <B>(second: Mock<B>) => <A>(first: Mock<A>) => Mock<B>;
export declare const apS: <N extends string, A, B>(name: Exclude<N, keyof A>, fb: Mock<B>) => (fa: Mock<A>) => Mock<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B; }>;
export declare const Applicative: Appli.Applicative1<URI>;
export declare const Chain: C.Chain1<URI>;
export declare const chain: <A, B>(a: (a: A) => Mock<B>) => (b: Mock<A>) => Mock<B>;
export declare const chainFirst: <A, B>(f: (a: A) => Mock<B>) => (first: Mock<A>) => Mock<A>;
export declare const bind: <N extends string, A, B>(name: Exclude<N, keyof A>, f: (a: A) => Mock<B>) => (ma: Mock<A>) => Mock<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B; }>;
export declare const Monad: M.Monad1<URI>;
export declare const FromIO: FIO.FromIO1<URI>;
export declare const fromIO: <A>(fa: IO.IO<A>) => Mock<A>;
export declare const fromIOK: <A extends readonly unknown[], B>(f: (...a: A) => IO.IO<B>) => (...a: A) => Mock<B>;
export declare const chainIOK: <A, B>(f: (a: A) => IO.IO<B>) => (first: Mock<A>) => Mock<B>;
export declare const chainFirstIOK: <A, B>(f: (a: A) => IO.IO<B>) => (first: Mock<A>) => Mock<A>;
export declare const MonadIO: MIO.MonadIO1<URI>;
declare const _void: Mock<void>;
declare const _undefined: Mock<undefined>;
declare const _null: Mock<null>;
export declare const boolean: Mock<boolean>;
export declare const float: (min?: number, max?: number) => Mock<number>;
export declare const integer: (min?: number, max?: number) => Mock<number>;
export declare const number: (min?: number, max?: number) => Mock<number>;
export declare const string: Mock<string>;
export declare const literal: <A extends string | number | boolean>(a: A) => Mock<A>;
export declare const unknown: (depth?: number) => Mock<unknown>;
export declare const nullable: <A>(M: Mock<A>) => Mock<A | undefined>;
export declare const tuple: <T extends Mock<any>[]>(...t: T & {
    readonly 0: Mock<any>;
}) => Mock<{ [K in keyof T]: [T[K]] extends [Mock<infer A>] ? A : never; }>;
export declare const struct: <NER extends Record<string, Mock<any>>>(r: keyof NER extends never ? never : NER) => Mock<{ [K in keyof NER]: [NER[K]] extends [Mock<infer A>] ? A : never; }>;
export declare const partial: <A>(Ms: EnforceNonEmptyRecord<{ readonly [K in keyof A]: Mock<A[K]>; }>) => Mock<Partial<Readonly<A>>>;
export declare function union<A, B, C, D, E, F, G, H, I, J>(a: Mock<A>, b: Mock<B>, c: Mock<C>, d: Mock<D>, e: Mock<E>, f: Mock<F>, g: Mock<G>, h: Mock<H>, i: Mock<I>, j: Mock<J>): Mock<A | B | C | D | E | F | G | H | I | J>;
export declare function union<A, B, C, D, E, F, G, H, I>(a: Mock<A>, b: Mock<B>, c: Mock<C>, d: Mock<D>, e: Mock<E>, f: Mock<F>, g: Mock<G>, h: Mock<H>, i: Mock<I>): Mock<A | B | C | D | E | F | G | H | I>;
export declare function union<A, B, C, D, E, F, G, H>(a: Mock<A>, b: Mock<B>, c: Mock<C>, d: Mock<D>, e: Mock<E>, f: Mock<F>, g: Mock<G>, h: Mock<H>): Mock<A | B | C | D | E | F | G | H>;
export declare function union<A, B, C, D, E, F, G>(a: Mock<A>, b: Mock<B>, c: Mock<C>, d: Mock<D>, e: Mock<E>, f: Mock<F>, g: Mock<G>): Mock<A | B | C | D | E | F | G>;
export declare function union<A, B, C, D, E, F>(a: Mock<A>, b: Mock<B>, c: Mock<C>, d: Mock<D>, e: Mock<E>, f: Mock<F>): Mock<A | B | C | D | E | F>;
export declare function union<A, B, C, D, E>(a: Mock<A>, b: Mock<B>, c: Mock<C>, d: Mock<D>, e: Mock<E>): Mock<A | B | C | D | E>;
export declare function union<A, B, C, D>(a: Mock<A>, b: Mock<B>, c: Mock<C>, d: Mock<D>): Mock<A | B | C | D>;
export declare function union<A, B, C>(a: Mock<A>, b: Mock<B>, c: Mock<C>): Mock<A | B | C>;
export declare function union<A, B>(a: Mock<A>, b: Mock<B>): Mock<A | B>;
export declare const readonlyArray: <A>(M: Mock<A>, min?: number, max?: number) => Mock<readonly A[]>;
export declare const readonlyNonEmptyArray: <A>(M: Mock<A>, min?: number, max?: number) => Mock<RNEA.ReadonlyNonEmptyArray<A>>;
export declare const readonlyRecord: <K extends string, T>(KM: Mock<K>, TM: Mock<T>, min?: number, max?: number) => Mock<Readonly<Record<K, T>>>;
export { _void as void, _undefined as undefined, _null as null };
