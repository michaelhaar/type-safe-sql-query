/**
 * Returns a new array containing the elements after the first match of a search string
 *
 * @note Search is case-insensitive
 *
 * @example
 * type T0 = GetSliceAfterFirstMatch<["a", "b", "c", "d"], "a">; // ["b", "c", "d"]
 * type T1 = GetSliceAfterFirstMatch<["a", "b", "c", "d"], "b" | "c">; // ["c", "d"]
 * type T2 = GetSliceAfterFirstMatch<["a", "b", "c", "d"], "d">; // []
 * type T3 = GetSliceAfterFirstMatch<["a", "b", "c", "d"], "e">; // []
 */
export type GetSliceAfterFirstMatch<Input extends string[], Search extends string> =
  Input extends [infer First extends string, ...infer Rest extends string[]] ?
    Uppercase<First> extends Uppercase<Search> ?
      Rest
    : GetSliceAfterFirstMatch<Rest, Search>
  : [];

/**
 * Similar to `GetSliceAfterFirstMatch` but includes the first match.
 *
 *  @note Search is case-insensitive
 *
 * @example
 * type T0 = GetSliceFromFirstMatch<["a", "b", "c", "d"], "b" | "c">; // ["b", "c", "d"]
 * type T1 = GetSliceFromFirstMatch<["a", "b", "c", "d"], "e">; // []
 */
export type GetSliceFromFirstMatch<Input extends string[], Search extends string> =
  Input extends [infer First extends string, ...infer Rest extends string[]] ?
    Uppercase<First> extends Uppercase<Search> ?
      [First, ...Rest]
    : GetSliceFromFirstMatch<Rest, Search>
  : [];

/**
 * Returns a new array containing the elements starting from the first non-match of a search string
 *
 * @note Search is case-insensitive
 *
 * @example
 * type T0 = GetSliceFromFirstNonMatch<["a", "b", "c", "d"], "a">; // ["b", "c", "d"]
 * type T1 = GetSliceFromFirstNonMatch<["a", "b", "c", "d"], "a" | "b">; // ["c", "d"]
 */
export type GetSliceFromFirstNonMatch<Input extends string[], Search extends string> =
  Input extends [infer First extends string, ...infer Rest extends string[]] ?
    Uppercase<First> extends Uppercase<Search> ?
      GetSliceFromFirstNonMatch<Rest, Search>
    : Input
  : Input;

/**
 * Returns a new array containing the elements before the first match of a search string
 *
 * @note Search is case-insensitive
 *
 * @example
 * type T0 = GetSliceBeforeFirstMatch<["a", "b", "c", "d"], "a">; // []
 * type T1 = GetSliceBeforeFirstMatch<["a", "b", "c", "d"], "c" | "d">; // ["a", "b"]
 * type T2 = GetSliceBeforeFirstMatch<["a", "b", "c", "d"], "e">; // ["a", "b", "c", "d"]
 */
export type GetSliceBeforeFirstMatch<Input extends string[], Search extends string> =
  Input extends [infer First extends string, ...infer Rest extends string[]] ?
    Uppercase<First> extends Uppercase<Search> ?
      []
    : [First, ...GetSliceBeforeFirstMatch<Rest, Search>]
  : Input;

/**
 * Slice tokens from a token array
 *
 * @note Search is case-insensitive
 *
 * @example
 * type T0 = GetSliceBetween<["a", "b", "c", "d"], "b", "c">; // []
 * type T1 = GetSliceBetween<["a", "b", "c", "d"], "b", "d">; // ["c"]
 * type T2 = GetSliceBetween<["a", "b", "c", "d"], "b", "e">; // ["c", "d"]
 */
export type GetSliceBetween<
  Input extends string[],
  From extends string,
  To extends string,
  InSlice extends boolean = false,
  Accumulated extends string[] = [],
> =
  Input extends [infer First extends string, ...infer Rest extends string[]] ?
    Uppercase<First> extends Uppercase<From> ? GetSliceBetween<Rest, From, To, true, Accumulated>
    : Uppercase<First> extends Uppercase<To> ?
      InSlice extends true ?
        Accumulated
      : GetSliceBetween<Rest, From, To, false, Accumulated>
    : InSlice extends true ? GetSliceBetween<Rest, From, To, true, [...Accumulated, First]>
    : GetSliceBetween<Rest, From, To, false, Accumulated>
  : Accumulated;

/**
 * Shift the first element from an array
 *
 * @example
 * type T0 = Shift<["a", "b", "c"]>; // ["b", "c"]
 */
export type Shift<Input extends string[]> = Input extends [infer _First, ...infer Rest] ? Rest : Input;

/**
 * Filter out elements from an array
 *
 * @note FilterType is case-insensitive
 *
 * @example
 * type T0 = FilterOut<[1, 2, 3, "a", "b", "c"], number>; // ["a", "b", "c"]
 * type T1 = FilterOut<[1, 2, 3, "a", "b", "c"], string>; // [1, 2, 3]
 * type T2 = FilterOut<[1, 2, 3, "a", "b", "c"], "a" | "b">; // [1, 2, 3, "c"]
 */
export type FilterOut<Arr extends string[], FilterType extends string> =
  Arr extends [infer First extends string, ...infer Rest extends string[]] ?
    Uppercase<First> extends Uppercase<FilterType> ?
      FilterOut<Rest, FilterType>
    : [First, ...FilterOut<Rest, FilterType>]
  : [];
