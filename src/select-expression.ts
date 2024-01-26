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

export type SelectExpressionToTableColumnTypeMap<
  SelectExpression,
  TableNames extends string[],
  AllTablesObj,
> = SelectExpression extends "*"
  ? TableNames[0] extends keyof AllTablesObj
    ? AllTablesObj[TableNames[0]]
    : never
  : SelectExpression extends `${infer TableName}.*`
    ? TableName extends keyof AllTablesObj
      ? AllTablesObj[TableName]
      : never
    : SelectExpression extends `${infer TableName}.${infer ColumnName}` // TODO: support nested?
      ? TableName extends keyof AllTablesObj
        ? ColumnName extends keyof AllTablesObj[TableName]
          ? { [K in ColumnName]: AllTablesObj[TableName][ColumnName] }
          : never
        : never
      : SelectExpression extends `${infer ColumnName}`
        ? TableNames[0] extends keyof AllTablesObj
          ? ColumnName extends keyof AllTablesObj[TableNames[0]]
            ? { [K in ColumnName]: AllTablesObj[TableNames[0]][ColumnName] }
            : never
          : never
        : never;
