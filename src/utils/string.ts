/**
 * Replace all occurrences of a string in another string
 * @example
 * type T0 = ReplaceSubstring<"a,b,c", ",", "">; // "abc"
 * type T1 = ReplaceSubstring<"a,b,c", ",", "-">; // "a-b-c"
 */
export type ReplaceSubstring<Input extends string, Search extends string, Replacement extends string> =
  Input extends `${infer Head}${Search}${infer Tail}` ?
    `${Head}${Replacement}${ReplaceSubstring<Tail, Search, Replacement>}`
  : Input;

/**
 * Replace all occurrences of strings in another string
 *
 * @example
 * type T0 = ReplaceMultipleSubstrings<"a,b;c", [",", ";"], ["", ""]>; // "abc"
 * type T1 = ReplaceMultipleSubstrings<"a,b;c", [",", ";"], ["-", ",">; // "a-b,c"
 */
export type ReplaceMultipleSubstrings<
  Input extends string,
  Search extends string[],
  Replacements extends string[],
  Result extends string = Input,
> =
  Search extends [infer FirstSearch extends string, ...infer RestSearch extends string[]] ?
    Replacements extends [infer FirstReplacement extends string, ...infer RestReplacement extends string[]] ?
      ReplaceMultipleSubstrings<ReplaceSubstring<Result, FirstSearch, FirstReplacement>, RestSearch, RestReplacement>
    : never
  : Result;

/**
 * Split a string by a delimiter
 *
 * @example
 * type T0 = Split<"a,b,c", ",">; // ["a", "b", "c"]
 * type T1 = Split<"a,b,c", "">; // ["a,b,c"]
 */
export type Split<Input extends string, Delimiter extends string> =
  Input extends `${infer First}${Delimiter}${infer Rest}` ? [First, ...Split<Rest, Delimiter>] : [Input];
