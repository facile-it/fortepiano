import * as E from 'fp-ts/Eq';
import * as RR from 'fp-ts/ReadonlyRecord';
export declare const values: <A>(as: Readonly<Record<string, A>>) => readonly A[];
export declare const same: <A>(E: E.Eq<A>) => (as: Readonly<Record<string, A>>) => boolean;
