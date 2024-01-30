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

import { Split } from "./utils";

/**
 * Extracts the `select_expr` part from a `SELECT` statement.
 * e.g ParseSelectExpressions<"col1, col2, col3"> => ["col1", "col2", "col3"]
 */
export type ParseSelectExpressions<Query extends string> = Split<Query, ", ">;

/**
 * Sanitizes the `select_expr` part from a `SELECT` statement.
 * e.g SanitizeSelectExpressions<["col1", "col2"], "tbl_name1">  => ["tbl_name1.col1", "tbl_name1.col2"]
 */
export type SanitizeSelectExpressions<S extends string[], DefaultTableName extends string> = S extends []
  ? []
  : S extends [infer First extends string, ...infer Rest extends string[]]
    ? First extends `${infer _TableName}.${infer _ColumnName}`
      ? [First, ...SanitizeSelectExpressions<Rest, DefaultTableName>]
      : [`${DefaultTableName}.${First}`, ...SanitizeSelectExpressions<Rest, DefaultTableName>]
    : never;

export type PickWithSanitizedSelectExpressions<Queries extends string[], Tables> = Queries extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? First extends `${infer TableName}.${infer RestOfFirst}`
    ? TableName extends keyof Tables
      ? RestOfFirst extends `*`
        ? Tables[TableName] & PickWithSanitizedSelectExpressions<Rest, Tables>
        : RestOfFirst extends `${infer ColumnName} ${"AS " | ""}${infer Alias}`
          ? ColumnName extends keyof Tables[TableName]
            ? { [K in Alias]: Tables[TableName][ColumnName] } & PickWithSanitizedSelectExpressions<Rest, Tables>
            : never
          : RestOfFirst extends keyof Tables[TableName]
            ? { [K in RestOfFirst]: Tables[TableName][RestOfFirst] } & PickWithSanitizedSelectExpressions<Rest, Tables>
            : never
      : never
    : never
  : {};
