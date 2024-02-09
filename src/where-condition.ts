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

type LogicalOperator = "AND" | "OR";

// 1. split the tokens into expressions
// 2. parse the expressions
//   a. first token is a column name?
//   b. if one of the other tokens is a question mark, then add column name to result array
// 3. return the result array
export type ParseParamsFromWhereConditionTokens<
  WhereConditionTokens extends string[],
  ColumnName extends string | null = null,
  Params extends string[] = [],
> =
  WhereConditionTokens extends [infer First extends string, ...infer Rest extends string[]] ?
    First extends LogicalOperator ? ParseParamsFromWhereConditionTokens<Rest, null, Params>
    : ColumnName extends null ? ParseParamsFromWhereConditionTokens<Rest, First, Params>
    : ColumnName extends string ?
      First extends "?" ? ParseParamsFromWhereConditionTokens<Rest, ColumnName, [...Params, ColumnName]>
      : First extends LogicalOperator ? ParseParamsFromWhereConditionTokens<Rest, null, Params>
      : ParseParamsFromWhereConditionTokens<Rest, ColumnName, Params>
    : never
  : Params;

// TODO improve docs
// TODO implement unit tests
