import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as t from 'io-ts';
export declare type Matrix<A> = t.Branded<ReadonlyArray<RNEA.ReadonlyNonEmptyArray<A>>, {
    readonly Matrix: unique symbol;
}>;
export declare const MatrixC: <C extends t.Mixed>(item: C) => t.BrandC<t.ReadonlyArrayC<import("io-ts-types").ReadonlyNonEmptyArrayC<C>>, {
    readonly Matrix: unique symbol;
}>;
export declare const transpose: <A>(as: Matrix<A>) => Matrix<A>;
