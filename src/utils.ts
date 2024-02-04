/**
 * Split a string by a delimiter
 * @example
 * type T0 = Split<"a,b,c", ",">; // ["a", "b", "c"]
 * type T1 = Split<"a,b,c", "">; // ["a,b,c"]
 */
export type Split<S extends string, Delimiter extends string> = S extends `${infer FirstPart}${Delimiter}${infer Rest}`
  ? [FirstPart, ...Split<Rest, Delimiter>]
  : [S];

/**
 * Filter out elements from an array
 * @example
 * type T0 = FilterOut<[1, 2, 3, "a", "b", "c"], number>; // ["a", "b", "c"]
 * type T1 = FilterOut<[1, 2, 3, "a", "b", "c"], string>; // [1, 2, 3]
 * type T2 = FilterOut<[1, 2, 3, "a", "b", "c"], "a" | "b">; // [1, 2, 3, "c"]
 */
export type FilterOut<Arr extends any[], FilterType> = Arr extends [infer First, ...infer Rest]
  ? First extends FilterType
    ? FilterOut<Rest, FilterType>
    : [First, ...FilterOut<Rest, FilterType>]
  : [];

/**
 * From U assign properties to T (just like object assign)
 * @example
 * type T0 = Assign<{ a: 1 }, { b: 2 }>; // { a: 1, b: 2 }
 * type T1 = Assign<{ a: 1 }, { a: 2 }>; // { a: 2 }
 */
export type Assign<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U ? U[K] : K extends keyof T ? T[K] : never;
};
