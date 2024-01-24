/**
 * Official MySQL documentation for table_references:
 * https://dev.mysql.com/doc/refman/8.0/en/join.html
 *
 * ```
 * table_references:
 *     escaped_table_reference [, escaped_table_reference] ...
 *
 * escaped_table_reference: {
 *     table_reference
 *   | { OJ table_reference }
 * }
 *
 * table_reference: {
 *     table_factor
 *   | joined_table
 * }
 *
 * table_factor: {
 *     tbl_name [PARTITION (partition_names)]
 *         [[AS] alias] [index_hint_list]
 *   | [LATERAL] table_subquery [AS] alias [(col_list)]
 *   | ( table_references )
 * }
 *
 * joined_table: {
 *     table_reference {[INNER | CROSS] JOIN | STRAIGHT_JOIN} table_factor [join_specification]
 *   | table_reference {LEFT|RIGHT} [OUTER] JOIN table_reference join_specification
 *   | table_reference NATURAL [INNER | {LEFT|RIGHT} [OUTER]] JOIN table_factor
 * }
 *
 * join_specification: {
 *     ON search_condition
 *   | USING (join_column_list)
 * }
 *
 * join_column_list:
 *     column_name [, column_name] ...
 *
 * index_hint_list:
 *     index_hint [, index_hint] ...
 *
 * index_hint: {
 *     USE {INDEX|KEY}
 *       [FOR {JOIN|ORDER BY|GROUP BY}] ([index_list])
 *   | {IGNORE|FORCE} {INDEX|KEY}
 *       [FOR {JOIN|ORDER BY|GROUP BY}] (index_list)
 * }
 *
 * index_list:
 *     index_name [, index_name] ...
 * ```
 */

/**
 * Not supported:
 * - PARTITION
 * - alias
 * - table_subquery
 * - index_hint_list
 * - join_specification
 */

import { Split } from "./utils";

type SplitBySpace<S extends string> = Split<S, " ">;

type JoinKeywords = "JOIN" | "INNER" | "CROSS" | "STRAIGHT_JOIN" | "LEFT" | "RIGHT" | "OUTER" | "NATURAL";
type Filter<Arr extends any[], FilterType> = Arr extends [infer First, ...infer Rest]
  ? First extends FilterType
    ? Filter<Rest, FilterType>
    : [First, ...Filter<Rest, FilterType>]
  : [];
type FilterKeywordsAndEmptyStrings<Arr extends any[]> = Filter<Arr, JoinKeywords | "">;

export type ParseTableReference<TableRef extends string> = FilterKeywordsAndEmptyStrings<SplitBySpace<TableRef>>;

export type ParseTableReferences<TableReferences extends string> =
  TableReferences extends `${infer FirstTableReference}, ${infer RestTableReferences}`
    ? [...ParseTableReference<FirstTableReference>, ...ParseTableReferences<RestTableReferences>]
    : TableReferences extends `${infer FirstTableReference} ${infer RestTableReferences}`
      ? [...ParseTableReference<FirstTableReference>, ...ParseTableReferences<RestTableReferences>]
      : [...ParseTableReference<TableReferences>];
