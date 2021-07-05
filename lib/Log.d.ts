import * as IO from 'fp-ts/IO';
import { _void } from './log/Void';
export declare type Logger = <A>(a: A) => IO.IO<void>;
export { _void };
