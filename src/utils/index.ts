import * as Array from "./array";
import * as String from "./string";

/**
 * Small util type to use as a placeholder for a type that we want to implement later
 * see:
 * - https://kyleshevlin.com/type-todo/
 * - https://youtu.be/QSIXYMIJkQg?feature=shared
 */
export type TODO = any;

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
export type Tokenize<S extends string> = Array.FilterOut<
  String.Split<String.ReplaceMultipleSubstrings<S, [",", "(", ")"], [" ", "( ", " )"]>, " ">,
  ""
>;

/**
 * Infer the `ParamsType` from the `Tables` type.
 *
 * Expects one of the following `ParamColumns` input formats:
 * - `["table.column", "table.column", ...]`
 * - `["column", "column", ...]`
 *
 * @example
 * type T0 = InferParamsType<["users.id", "users.name"], { users: { id: number, name: string, age: number } }>; // [number, string]
 * type T1 = InferParamsType<["users.id", "users.age"], { users: { id: number, name: string, age: number } }>; // [number, number]
 * type T2 = InferParamsType<["id", "name"], { users: { id: number, name: string, age: number } }, "users">; // [number, string]
 * type T3 = InferParamsType<["id", "age"], { users: { id: number, name: string, age: number } }, "users">; // [number, number]
 */
export type InferParamsType<ParamColumns extends string[], Tables, FallbackTblName extends string = ""> =
  ParamColumns extends [infer First, ...infer Rest extends string[]] ?
    First extends `${infer TblName}.${infer ColumnName}` ?
      TblName extends keyof Tables ?
        ColumnName extends keyof Tables[TblName] ?
          [Tables[TblName][ColumnName], ...InferParamsType<Rest, Tables, FallbackTblName>]
        : [never, ...InferParamsType<Rest, Tables, FallbackTblName>]
      : [never, ...InferParamsType<Rest, Tables, FallbackTblName>]
    : FallbackTblName extends keyof Tables ?
      First extends keyof Tables[FallbackTblName] ?
        [Tables[FallbackTblName][First], ...InferParamsType<Rest, Tables, FallbackTblName>]
      : [never, ...InferParamsType<Rest, Tables, FallbackTblName>]
    : [never, ...InferParamsType<Rest, Tables, FallbackTblName>]
  : [];
