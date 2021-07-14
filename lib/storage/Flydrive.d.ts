import { StorageManager } from '@slynova/flydrive';
import { Lazy } from 'fp-ts/function';
import * as $Sto from '../Storage';
export declare const $flydrive: (flydrive: Lazy<StorageManager>) => $Sto.Storage;
