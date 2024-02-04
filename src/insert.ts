/**
 * Official documentation for the `INSERT` statement:
 * https://dev.mysql.com/doc/refman/8.0/en/insert.html
 *
 * The exact syntax of the `INSERT` statement is not needed to infer the return type, because it
 * seems like the returned value is always a string.
 *
 * For the sake of completeness, here is the syntax of the `INSERT` statement:
 *
 * ```
 * INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE]
 *     [INTO] tbl_name
 *     [PARTITION (partition_name [, partition_name] ...)]
 *     [(col_name [, col_name] ...)]
 *     { {VALUES | VALUE} (value_list) [, (value_list)] ... }
 *     [AS row_alias[(col_alias [, col_alias] ...)]]
 *     [ON DUPLICATE KEY UPDATE assignment_list]
 *
 * INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE]
 *     [INTO] tbl_name
 *     [PARTITION (partition_name [, partition_name] ...)]
 *     SET assignment_list
 *     [AS row_alias[(col_alias [, col_alias] ...)]]
 *     [ON DUPLICATE KEY UPDATE assignment_list]
 *
 * INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
 *     [INTO] tbl_name
 *     [PARTITION (partition_name [, partition_name] ...)]
 *     [(col_name [, col_name] ...)]
 *     { SELECT ...
 *       | TABLE table_name
 *       | VALUES row_constructor_list
 *     }
 *     [ON DUPLICATE KEY UPDATE assignment_list]
 *
 * value:
 *     {expr | DEFAULT}
 *
 * value_list:
 *     value [, value] ...
 *
 * row_constructor_list:
 *     ROW(value_list)[, ROW(value_list)][, ...]
 *
 * assignment:
 *     col_name =
 *           value
 *         | [row_alias.]col_name
 *         | [tbl_name.]col_name
 *         | [row_alias.]col_alias
 *
 * assignment_list:
 *     assignment [, assignment] ...
 * ```
 */

export type IsInsertStatement<Query extends string> = Query extends `INSERT ${string}` ? true : false;

export type ReturnTypeFromInsertStatement = string;
