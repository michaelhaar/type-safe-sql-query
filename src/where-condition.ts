/**
 * The official MySQL documentation mentions the `where_condition` in e.g the `SELECT` and `DELETE` statement. see:
 * - https://dev.mysql.com/doc/refman/8.0/en/select.html
 * - https://dev.mysql.com/doc/refman/8.0/en/delete.html
 *
 * Unfortunately, the documentation does not provide a formal definition of the `where_condition`. It seems like the
 * specification for the `where_condition` would look like this:
 *
 * ```
 * WHERE_CONDITION ::=
 *     expression [LOGICAL_OPERATOR expression]...
 *
 * expression ::=
 *     column_name COMPARISON_OPERATOR value
 *     | column_name COMPARISON_OPERATOR column_name
 *     | function_name(arguments)
 *     | expression COMPARISON_OPERATOR expression
 *     | '(' expression ')'
 *
 * LOGICAL_OPERATOR ::=
 *     AND | OR | NOT
 *
 * COMPARISON_OPERATOR ::=
 *     = | != | < | > | <= | >= | LIKE | IN | BETWEEN | IS NULL | IS NOT NULL
 */

type LogicalOperator = "AND" | "OR" | "NOT";

/**
 * Parse the Params from the `where_condition` tokens.
 *
 * @example
 * type T0 = ParseParamsFromWhereClauseTokens<["id", "=", "?"]>; // ["id"]
 * type T1 = ParseParamsFromWhereClauseTokens<["id", "=", "?", "AND", "name", "=", "?", "OR", "age", "=", "?"], null>; // ["id", "name", "age"]
 */
export type ParseParamsFromWhereClauseTokens<
  WhereConditionTokens extends string[],
  ColumnName extends string | null = null,
  Params extends string[] = [],
> =
  WhereConditionTokens extends [infer First extends string, ...infer Rest extends string[]] ?
    Uppercase<First> extends Uppercase<LogicalOperator> ? ParseParamsFromWhereClauseTokens<Rest, null, Params>
    : ColumnName extends null ? ParseParamsFromWhereClauseTokens<Rest, First, Params>
    : ColumnName extends string ?
      First extends "?" ? ParseParamsFromWhereClauseTokens<Rest, ColumnName, [...Params, ColumnName]>
      : Uppercase<First> extends Uppercase<LogicalOperator> ? ParseParamsFromWhereClauseTokens<Rest, null, Params>
      : ParseParamsFromWhereClauseTokens<Rest, ColumnName, Params>
    : never
  : Params;
