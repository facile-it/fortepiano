import { constVoid } from 'fp-ts/function'
import * as $L from '../Log'

const _void: $L.Logger = () => constVoid

export { _void as void }
