import * as M from 'fp-ts/Magma';
export declare const concatAll: <A>(M: M.Magma<A>) => (startWith: A) => (as: readonly A[]) => A;
