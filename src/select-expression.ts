/**
 * Official MySQL documentation for SELECT:
 * https://dev.mysql.com/doc/refman/8.0/en/select.html
 *
 * Unfortunately, the documentation is not very clear on the syntax of the `select_expr` part.
 *
 * From the documentation, it seems like `select_expr` is specified as one of the following:
 *
 * ```
 * select_expressions:
 *     select_expr [, select_expr] ...
 *
 * select_expr:
 *    `*`
 *   | tbl_name.`*`
 *   | col_name [[AS] alias]
 *   | tbl_name.col_name [AS alias]
 *   | TODO: add Functions (COUNT, SUM, AVG, etc.), Expressions (1 + 1, etc.) and Things like `DISTINCT`?
 * ```
 *
 *
 *
 * Not supported ATM:
 *  - AS alias
 *  - Functions (COUNT, SUM, AVG, etc.)
 *  - Expressions (1 + 1, etc.)
 *  - Things like `DISTINCT`
 */

import { Object, String } from "./utils";

/**
 * Extracts the `select_expr` part from a `SELECT` statement.
 * e.g ParseSelectExpressions<"col1, col2, col3"> => ["col1", "col2", "col3"]
 */
export type ParseSelectExpressions<Query extends string> = String.Split<Query, ", ">;

/**
 * Sanitizes the `select_expr` part from a `SELECT` statement.
 * e.g SanitizeSelectExpressions<["col1", "col2"], "tbl_name1">  => ["tbl_name1.col1", "tbl_name1.col2"]
 */
export type SanitizeSelectExpressions<S extends string[], DefaultTableName extends string> =
  S extends [] ? []
  : S extends [infer First extends string, ...infer Rest extends string[]] ?
    First extends `${infer _TableName}.${infer _ColumnName}` ?
      [First, ...SanitizeSelectExpressions<Rest, DefaultTableName>]
    : [`${DefaultTableName}.${First}`, ...SanitizeSelectExpressions<Rest, DefaultTableName>]
  : never;

type ExtractColumnName<S extends string> =
  S extends `${infer ColumnName1} AS ${string}` ? ColumnName1
  : S extends `${infer ColumnName2} ${string}` ? ColumnName2
  : S;

type ExtractAlias<S extends string> =
  S extends `${string} AS ${infer Alias1}` ? Alias1
  : S extends `${string} ${infer Alias2}` ? Alias2
  : S;

export type PickWithSanitizedSelectExpressions<Queries extends string[], Tables> =
  Queries extends [infer First extends string, ...infer Rest extends string[]] ?
    First extends `${infer TableName}.${infer RestOfFirst}` ?
      TableName extends keyof Tables ?
        RestOfFirst extends `*` ? Tables[TableName] & PickWithSanitizedSelectExpressions<Rest, Tables>
        : ExtractColumnName<RestOfFirst> extends keyof Tables[TableName] ?
          Object.ExpandRecursively<
            {
              [K in ExtractAlias<RestOfFirst>]: Tables[TableName][ExtractColumnName<RestOfFirst>];
            } & PickWithSanitizedSelectExpressions<Rest, Tables>
          >
        : never
      : never
    : never
  : {};
