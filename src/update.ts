/**
 * Official documentation for the `UPDATE` statement:
 * https://dev.mysql.com/doc/refman/8.0/en/update.html
 *
 * The exact syntax of the `UPDATE` statement is not needed to infer the return type, because it
 * seems like the returned value is always a string.
 *
 * For the sake of completeness, here is the syntax of the `UPDATE` statement for a single table:
 *
 * ```
 * UPDATE [LOW_PRIORITY] [IGNORE] table_reference
 *     SET assignment_list
 *     [WHERE where_condition]
 *     [ORDER BY ...]
 *     [LIMIT row_count]
 *
 * value:
 *     {expr | DEFAULT}
 *
 * assignment:
 *     col_name = value
 *
 * assignment_list:
 *     assignment [, assignment] ...
 * ```
 */

export type IsUpdateStatement<Query extends string> = Query extends `UPDATE ${string}` ? true : false;

export type ReturnTypeFromUpdateStatement = string;
