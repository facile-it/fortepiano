import { Lazy } from 'fp-ts/function';
import Memcached from 'memcached';
import * as $C from '../Cache';
export declare const $memcached: (memcached: Lazy<Memcached>, ttl?: number) => $C.Cache;
