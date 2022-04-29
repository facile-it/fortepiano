import { constVoid } from 'fp-ts/function'
import { Logger } from '../Log'

const _void: Logger = () => constVoid

export { _void as void }
