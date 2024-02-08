/**
 * Nice little util type to use as a placeholder for a type that you want to implement later
 * see:
 * - https://kyleshevlin.com/type-todo/
 * - https://youtu.be/QSIXYMIJkQg?feature=shared
 */
export type TODO = any;

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
 * Util to expand computed TypeScript types on hover
 * see: https://github.com/microsoft/vscode/issues/94679
 * see: https://stackoverflow.com/a/57683652
 */
export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

/**
 * Replace all occurrences of a string in another string
 * @example
 * type T0 = Replace<"a,b,c", ",", "">; // "abc"
 * type T1 = Replace<"a,b,c", ",", "-">; // "a-b-c"
 */
export type Replace<
  Input extends string,
  Search extends string,
  Replacement extends string,
> = Input extends `${infer Head}${Search}${infer Tail}`
  ? `${Head}${Replacement}${Replace<Tail, Search, Replacement>}`
  : Input;

/**
 * Replace multiple occurrences of strings in another string
 * @example
 * type T0 = ReplaceMultiple<"a,b;c", [",", ";"], ["", ""]>; // "abc"
 * type T1 = ReplaceMultiple<"a,b;c", [",", ";"], ["-", ",">; // "a-b,c"
 */
export type ReplaceMultiple<
  Input extends string,
  Search extends string[],
  Replacements extends string[],
  Result extends string = Input,
> = Search extends [infer FirstSearch extends string, ...infer RestSearch extends string[]]
  ? Replacements extends [infer FirstReplacement extends string, ...infer RestReplacement extends string[]]
    ? ReplaceMultiple<Replace<Result, FirstSearch, FirstReplacement>, RestSearch, RestReplacement>
    : never
  : Result;

/**
 * Tokenize a string.
 *
 * A tokenizer breaks a stream of text into tokens, usually by looking for whitespace (tabs, spaces, new lines).
 *
 * This type takes a string and returns an array of tokens.
 *
 * @example
 * type T0 = Tokenize<"INSERT INTO tab_name (col1, col2) VALUES (?, ?)">; // ["INSERT", "INTO", "tab_name", "(", "col1", "col2", ")", "VALUES", "(", "?", "?", ")"]
 */
export type Tokenize<S extends string> = FilterOut<
  Split<ReplaceMultiple<S, [",", "(", ")"], [" ", "( ", " )"]>, " ">,
  ""
>;

/**
 * Slice tokens from a token array until a match is found
 *
 * @example
 * type T0 = SliceUntilMatch<["a", "b", "c", "d"], "a">; // ["b", "c", "d"]
 * type T1 = SliceUntilMatch<["a", "b", "c", "d"], "b">; // ["c", "d"]
 */
export type SliceUntilMatch<Tokens extends string[], Search extends string> = Tokens extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? First extends Search
    ? Rest
    : SliceUntilMatch<Rest, Search>
  : [];

/**
 * Slice tokens from a token array until a match is not found
 *
 * @example
 * type T0 = SliceUntilNotMatch<["a", "b", "c", "d"], "a">; // ["b", "c", "d"]
 * type T1 = SliceUntilNotMatch<["a", "b", "c", "d"], "a" | "b">; // ["c", "d"]
 */
export type SliceUntilNoMatch<Tokens extends string[], Search extends string> = Tokens extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? First extends Search
    ? SliceUntilNoMatch<Rest, Search>
    : Tokens
  : Tokens;

/**
 * Slice tokens from a token array
 *
 * @example
 * type T0 = Slice<["a", "b", "c", "d"], "b", "c">; // []
 * type T1 = Slice<["a", "b", "c", "d"], "b", "d">; // ["c"]
 * type T2 = Slice<["a", "b", "c", "d"], "b", "e">; // ["c", "d"]
 */
export type Slice<
  Tokens extends any[],
  From extends string,
  To extends string,
  InSlice extends boolean = false,
  Accumulated extends any[] = [],
> = Tokens extends [infer First, ...infer Rest]
  ? First extends From
    ? Slice<Rest, From, To, true, Accumulated>
    : First extends To
      ? InSlice extends true
        ? Accumulated
        : Slice<Rest, From, To, false, Accumulated>
      : InSlice extends true
        ? Slice<Rest, From, To, true, [...Accumulated, First]>
        : Slice<Rest, From, To, false, Accumulated>
  : Accumulated;
