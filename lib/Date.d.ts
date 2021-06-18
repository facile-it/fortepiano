import * as O from 'fp-ts/Option';
export declare const fromDate: (date: Date) => O.Option<Date>;
export declare const fromString: (date: string) => O.Option<Date>;
export declare const parse: (date: string) => O.Option<number>;
