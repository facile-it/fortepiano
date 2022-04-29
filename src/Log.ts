import { IO } from 'fp-ts/IO'
import { void as _void } from './log/Void'

export type Logger = (...as: ReadonlyArray<unknown>) => IO<void>

export { _void as void }
