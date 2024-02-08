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
 * type T0 = ReplaceMultiple<"a,b;c", [",", ";"], "">; // "abc"
 * type T1 = ReplaceMultiple<"a,b;c", [",", ";"], "-">; // "a-b-c"
 */
export type ReplaceMultiple<
  Input extends string,
  Search extends string[],
  Replacement extends string,
  Result extends string = Input,
> = Search extends [infer FirstSearch extends string, ...infer RestSearch extends string[]]
  ? ReplaceMultiple<Result, RestSearch, Replacement, Replace<Result, FirstSearch, Replacement>>
  : Result;

/**
 * Tokenize a string.
 *
 * A tokenizer breaks a stream of text into tokens, usually by looking for whitespace (tabs, spaces, new lines).
 *
 * This type takes a string and returns an array of tokens.
 *
 * @example
 * type T0 = Tokenize<"INSERT INTO tab_name (col1, col2) VALUES (?, ?)">; // ["INSERT", "INTO", "tab_name", "col1", "col2", "VALUES", "?", "?"]
 */
export type Tokenize<S extends string> = FilterOut<Split<ReplaceMultiple<S, [",", "(", ")"], " ">, " ">, "">;
