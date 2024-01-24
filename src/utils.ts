/**
 * Split a string by a delimiter
 * @example
 * type T0 = Split<"a,b,c", ",">; // ["a", "b", "c"]
 * type T1 = Split<"a,b,c", "">; // ["a,b,c"]
 */
export type Split<S extends string, Delimiter extends string> = S extends `${infer FirstPart}${Delimiter}${infer Rest}`
  ? [FirstPart, ...Split<Rest, Delimiter>]
  : [S];
