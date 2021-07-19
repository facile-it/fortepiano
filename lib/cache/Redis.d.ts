import { Lazy } from 'fp-ts/function';
import { RedisClient } from 'redis';
import * as $C from '../Cache';
export declare const $redis: (redis: Lazy<RedisClient>, ttl?: number) => $C.Cache;
