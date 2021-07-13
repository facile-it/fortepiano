import { RedisClient } from 'redis';
import * as $C from '../Cache';
export declare const $redis: (redis: RedisClient, ttl?: number) => $C.Cache;
