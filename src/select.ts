/**
 * Official MySQL documentation for SELECT:
 * https://dev.mysql.com/doc/refman/8.0/en/select.html
 *
 * ```
 * SELECT
 *     [ALL | DISTINCT | DISTINCTROW ]
 *     [HIGH_PRIORITY]
 *     [STRAIGHT_JOIN]
 *     [SQL_SMALL_RESULT] [SQL_BIG_RESULT] [SQL_BUFFER_RESULT]
 *     [SQL_NO_CACHE] [SQL_CALC_FOUND_ROWS]
 *     select_expr [, select_expr] ...
 *     [into_option]
 *     [FROM table_references
 *       [PARTITION partition_list]]
 *     [WHERE where_condition]
 *     [GROUP BY {col_name | expr | position}, ... [WITH ROLLUP]]
 *     [HAVING where_condition]
 *     [WINDOW window_name AS (window_spec)
 *         [, window_name AS (window_spec)] ...]
 *     [ORDER BY {col_name | expr | position}
 *       [ASC | DESC], ... [WITH ROLLUP]]
 *     [LIMIT {[offset,] row_count | row_count OFFSET offset}]
 *     [into_option]
 *     [FOR {UPDATE | SHARE}
 *         [OF tbl_name [, tbl_name] ...]
 *         [NOWAIT | SKIP LOCKED]
 *       | LOCK IN SHARE MODE]
 *     [into_option]
 *
 * into_option: {
 *     INTO OUTFILE 'file_name'
 *         [CHARACTER SET charset_name]
 *         export_options
 *   | INTO DUMPFILE 'file_name'
 *   | INTO var_name [, var_name] ...
 * }
 * ```
 */

/**
 * Assumptions:
 * - Keywords are always uppercase
 * - Whitespace is always a single space
 * - TODO: Add Notes on Quotes
 */

/**
 * Not supported:
 * - TODO: add keywords
 */

import {
  ParseSelectExpressions,
  PickWithSanitizedSelectExpressions,
  SanitizeSelectExpressions,
} from "./select-expression";
import { ParseTableReferences } from "./table-references";

export type ParseSelectStatement<Query extends string> =
  Query extends `SELECT ${infer SelectExpressionsString} FROM ${infer TableReferencesString}`
    ? {
        selectExpressionsString: SelectExpressionsString;
        tableReferencesString: TableReferencesString;
      }
    : never;

export type GetTableNames<Query extends string> = ParseTableReferences<
  ParseSelectStatement<Query>["tableReferencesString"]
>;
export type GetSelectExpressions<Query extends string> = ParseSelectExpressions<
  ParseSelectStatement<Query>["selectExpressionsString"]
>;
export type GetSanitizedSelectExpressions<Query extends string> = SanitizeSelectExpressions<
  GetSelectExpressions<Query>,
  GetTableNames<Query>[0]
>;

export type InferReturnTypeFromSelectStatement<Query extends string, Tables> = PickWithSanitizedSelectExpressions<
  GetSanitizedSelectExpressions<Query>,
  Tables
>[];
