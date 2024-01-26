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
 *   | tbl_name.`*` [[AS] alias]
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

export type ParseSelectExpressions<Query extends string> = Query extends `${infer SelectExpressions}, ${infer Rest}`
  ? [SelectExpressions, ...ParseSelectExpressions<Rest>]
  : [Query];

export type SanitizedSelectExpressions<S extends string[], DefaultTableName extends string> = S extends []
  ? []
  : S extends [infer First extends string, ...infer Rest extends string[]]
    ? First extends `${infer _TableName}.${infer _ColumnName}`
      ? [First, ...SanitizedSelectExpressions<Rest>]
      : [`${DefaultTableName}.${First}`, ...SanitizedSelectExpressions<Rest>]
    : never;

export type PickWithSanitizedSelectExpressions<Queries extends string[], Tables> = Queries extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? First extends `${infer TableName}.*`
    ? TableName extends keyof Tables
      ? Tables[TableName] & PickWithSanitizedSelectExpressions<Rest, Tables>
      : never
    : First extends `${infer TableName}.${infer ColumnName}`
      ? TableName extends keyof Tables
        ? ColumnName extends keyof Tables[TableName]
          ? { [K in ColumnName]: Tables[TableName][ColumnName] } & PickWithSanitizedSelectExpressions<Rest, Tables>
          : never
        : never
      : never
  : {};
