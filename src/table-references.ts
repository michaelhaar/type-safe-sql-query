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
 * - table_subquery
 * - index_hint_list
 * - join_specification
 */

type OptionalAs = "AS " | "";
export type ParseTableFactor<TableFactor extends string> =
  TableFactor extends `${infer TableName} ${OptionalAs}${infer _ALIAS}`
    ? TableName
    : TableFactor extends `${infer TableName}`
      ? TableName
      : never;

// JoinedTable of type A
// table_reference {[INNER | CROSS] JOIN | STRAIGHT_JOIN} table_factor [join_specification]
type KeywordVariantsTypeA = `INNER JOIN` | `CROSS JOIN` | "STRAIGHT_JOIN";
type IsJoinedTableTypeA<TableReference extends string> =
  TableReference extends `${infer _TableReference} ${KeywordVariantsTypeA | "JOIN"} ${infer _TableFactor}`
    ? true
    : false;

export type ParseJoinedTableTypeA<JoinedTable extends string> =
  JoinedTable extends `${infer TableReference} ${KeywordVariantsTypeA} ${infer TableFactor}`
    ? [TableReference, TableFactor]
    : JoinedTable extends `${infer TableReference} JOIN ${infer TableFactor}`
      ? [TableReference, TableFactor]
      : never;

// JoinedTable of type B
// table_reference {LEFT|RIGHT} [OUTER] JOIN table_reference join_specification
type KeywordVariantsTypeB = "LEFT JOIN" | "LEFT OUTER JOIN" | "RIGHT JOIN" | "RIGHT OUTER JOIN";
type IsJoinedTableTypeB<TableReference extends string> =
  TableReference extends `${infer _TableReference} ${KeywordVariantsTypeB} ${infer _TableReference}` ? true : false;

export type ParseJoinedTableTypeB<JoinedTable extends string> =
  JoinedTable extends `${infer TableReference} ${KeywordVariantsTypeB} ${infer TableFactor}`
    ? [TableReference, TableFactor]
    : never;

// JoinedTable of type C
// table_reference NATURAL [INNER | {LEFT|RIGHT} [OUTER]] JOIN table_factor
type KeyWordVariantsTypeC =
  | "NATURAL LEFT JOIN"
  | "NATURAL LEFT OUTER JOIN"
  | "NATURAL RIGHT JOIN"
  | "NATURAL RIGHT OUTER JOIN"
  | "NATURAL INNER JOIN"
  | "NATURAL JOIN";
type IsJoinedTableTypeC<TableReference extends string> =
  TableReference extends `${infer _TableReference} ${KeyWordVariantsTypeC} ${infer _TableFactor}` ? true : false;

export type ParseJoinedTableTypeC<JoinedTable extends string> =
  JoinedTable extends `${infer TableReference} ${KeyWordVariantsTypeC} ${infer TableFactor}`
    ? [TableReference, TableFactor]
    : never;

type IsJoinedTable<TableReference extends string> =
  IsJoinedTableTypeA<TableReference> extends true
    ? true
    : IsJoinedTableTypeB<TableReference> extends true
      ? true
      : IsJoinedTableTypeC<TableReference> extends true
        ? true
        : false;

export type ParseJoinedTable<JoinedTable extends string> =
  IsJoinedTableTypeA<JoinedTable> extends true
    ? ParseJoinedTableTypeA<JoinedTable>
    : IsJoinedTableTypeB<JoinedTable> extends true
      ? ParseJoinedTableTypeB<JoinedTable>
      : IsJoinedTableTypeC<JoinedTable> extends true
        ? ParseJoinedTableTypeC<JoinedTable>
        : never;

export type ParseTableReference<TableReference extends string> =
  IsJoinedTable<TableReference> extends true ? ParseJoinedTable<TableReference> : ParseTableFactor<TableReference>;
