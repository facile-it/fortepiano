import { RedisClient } from 'redis';
import * as $C from '../Cache';
export declare const redis: (_redis: RedisClient, ttl?: number) => $C.Cache;
