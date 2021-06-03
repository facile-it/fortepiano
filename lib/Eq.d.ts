import * as E from 'fp-ts/Eq';
import * as $A from './Aggregate';
export declare const eqType: E.Eq<unknown>;
export declare const getEqSize: <T>(A: $A.Aggregate<T>) => E.Eq<T>;
