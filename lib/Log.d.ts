import * as IO from 'fp-ts/IO';
import * as RR from 'fp-ts/ReadonlyRecord';
import { _void } from './log/Void';
export declare type Logger = <A>(a: A) => IO.IO<void>;
export declare type HasLog<K extends string = 'log'> = RR.ReadonlyRecord<K, {
    readonly log: Logger;
    readonly warn: Logger;
    readonly error: Logger;
    readonly info: Logger;
}>;
export { _void };