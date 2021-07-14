import Memcached from 'memcached';
import * as $C from '../Cache';
export declare const $memcached: (memcached: Memcached, ttl?: number) => $C.Cache;
