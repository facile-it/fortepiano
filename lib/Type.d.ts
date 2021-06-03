import * as t from 'io-ts';
export declare function literal<V extends number | string>(value: V, name?: string): t.LiteralC<V>;
export declare function literal(regExp: RegExp, name?: string): t.StringC;
export declare const struct: t.Type<object, object, unknown>;
export declare const nullable: <C extends t.Mixed>(codec: C, name?: string | undefined) => t.UnionC<[C, t.UndefinedC]>;
export declare const alias: <C extends t.Mixed>(name: string, { is, decode, encode }: C) => t.Type<t.TypeOf<C>, t.OutputOf<C>, t.InputOf<C>>;
export declare function literalUnion<A extends number | string, B extends {
    [K in A]: null;
}>(strings: [A, A, ...ReadonlyArray<A>], name?: string): t.KeyofC<B>;
export declare const lax: <P extends t.Props>(props: P, name?: string | undefined) => t.Type<{ [K in keyof P]?: t.TypeOf<P[K]> | undefined; }, { [K_1 in keyof P]?: t.OutputOf<P[K_1]> | undefined; }, unknown>;
