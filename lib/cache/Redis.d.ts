import { ClientOpts } from 'redis';
import * as $C from '../Cache';
export declare const $redis: (config: ClientOpts, ttl?: number) => $C.Cache;
