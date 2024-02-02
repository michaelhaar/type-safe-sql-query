/**
 * Official MySQL documentation for DELETE:
 * https://dev.mysql.com/doc/refman/8.0/en/delete.html
 *
 * The exact syntax of the `DELETE` statement is not needed to infer the return type, because it seems
 * like the returned value is always a string.
 *
 * For the sake of completeness, here is the syntax of the `DELETE` statement for a single table:
 *
 * ```
 * DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM tbl_name [[AS] tbl_alias]
 *  [PARTITION (partition_name [, partition_name] ...)]
 *  [WHERE where_condition]
 *  [ORDER BY ...]
 *  [LIMIT row_count]
 * ```
 */

export type IsDeleteStatement<Query extends string> = Query extends `DELETE ${infer _Rest}` ? true : false;

export type ReturnTypeFromDeleteStatement = string;
