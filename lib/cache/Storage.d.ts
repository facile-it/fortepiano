import { Lazy } from 'fp-ts/function';
import * as $C from '../Cache';
declare const _storage: (storage: Lazy<Storage>, name?: string | undefined, ttl?: number) => $C.Cache;
export { _storage as storage };
