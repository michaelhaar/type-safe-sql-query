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
 * Not supported:
 * - TODO: add info from deleted table-references and select-expressions files
 */

import { Object, Array, TablesBase, Tokenize, InferParamsType } from "./utils";
import { ParseParamsFromWhereClauseTokens } from "./where-condition";

export type IsSelectStatement<Query extends string> = Uppercase<Query> extends `SELECT ${string}` ? true : false;

type JoinKeywords = "JOIN" | "INNER" | "CROSS" | "STRAIGHT_JOIN" | "LEFT" | "RIGHT" | "OUTER" | "NATURAL";
type OtherKeyword = "GROUP BY" | "HAVING" | "WINDOW" | "ORDER BY" | "LIMIT" | "INTO" | "FOR";

/**
 * Infer the `ReturnType` from the `Tables` type.
 *
 * @example
 * type TestTable = { users: { id: number, name: string, age: number }};
 * type T0 = InferReturnType<["users.id", "users.name"], TestTable>; // { id: number, name: string }
 * type T1 = InferReturnType<["users.id", "users.age"], TestTable>; // { id: number, age: number }
 */
export type InferReturnType<SelectedColumns extends string[], Tables> =
  SelectedColumns extends [infer First extends string, ...infer Rest extends string[]] ?
    First extends `${infer TableName}.${infer ColumnName}` ?
      TableName extends keyof Tables ?
        ColumnName extends `*` ? Tables[TableName] & InferReturnType<Rest, Tables>
        : ColumnName extends keyof Tables[TableName] ?
          {
            [K in ColumnName]: Tables[TableName][ColumnName];
          } & InferReturnType<Rest, Tables>
        : never
      : never
    : never
  : {};

/**
 * Sanitizes the `select_expr` part from a `SELECT` statement.
 *
 * @example
 * type T0 = SanitizeSelectExpressions<["col1", "col2"], "tbl_name1">  => ["tbl_name1.col1", "tbl_name1.col2"]
 * type T1 = SanitizeSelectExpressions<["col1", "tbl_name2.col1"], "tbl_name1">  => ["tbl_name1.col1", "tbl_name2.col1"]
 */
export type SanitizeColumnNames<S extends string[], DefaultTableName extends string> =
  S extends [] ? []
  : S extends [infer First extends string, ...infer Rest extends string[]] ?
    First extends `${infer _TableName}.${infer _ColumnName}` ?
      [First, ...SanitizeColumnNames<Rest, DefaultTableName>]
    : [`${DefaultTableName}.${First}`, ...SanitizeColumnNames<Rest, DefaultTableName>]
  : never;

type SelectAst = {
  query: string;
  tables: TablesBase;
  tokens: string[];
  index: number;
  selectExprTokens: string[];
  tableRefTokens: string[];
  whereClauseTokens: string[];
  paramColumns: string[];
};

type Parse<
  AstPatch extends Partial<SelectAst>,
  AstState extends SelectAst = {
    query: "";
    tables: {};
    tokens: [];
    index: 0;
    selectExprTokens: [];
    tableRefTokens: [];
    whereClauseTokens: [];
    paramColumns: [];
  },
> =
  Object.Overwrite<AstState, AstPatch> extends infer Ast extends SelectAst ?
    Ast["index"] extends 0 ?
      Parse<
        {
          query: Ast["query"];
          tables: Ast["tables"];
          tokens: Tokenize<Ast["query"]>;
          index: 1;
        },
        Ast
      >
    : Ast["index"] extends 1 ?
      Parse<
        {
          tokens: Array.GetSliceFromFirstNonMatch<
            Ast["tokens"],
            | "SELECT"
            | "ALL"
            | "DISTINCT"
            | "DISTINCTROW"
            | "HIGH_PRIORITY"
            | "STRAIGHT_JOIN"
            | "SQL_SMALL_RESULT"
            | "SQL_BIG_RESULT"
            | "SQL_BUFFER_RESULT"
            | "SQL_NO_CACHE"
            | "SQL_CALC_FOUND_ROWS"
          >;
          index: 2;
        },
        Ast
      >
    : Ast["index"] extends 2 ?
      Parse<
        {
          selectExprTokens: Array.GetSliceBeforeFirstMatch<Ast["tokens"], "INTO" | "FROM" | "WHERE" | OtherKeyword>;
          tableRefTokens: Array.GetSliceBetween<Ast["tokens"], "FROM", "WHERE" | OtherKeyword>;
          whereClauseTokens: Array.GetSliceBetween<Ast["tokens"], "WHERE", OtherKeyword>;
          index: 3;
        },
        Ast
      >
    : Ast["index"] extends 3 ?
      Parse<
        {
          tableRefTokens: Array.FilterOut<Ast["tableRefTokens"], JoinKeywords | "">;
          paramColumns: ParseParamsFromWhereClauseTokens<Ast["whereClauseTokens"]>;
          index: 4;
        },
        Ast
      >
    : Ast["index"] extends 4 ?
      Parse<
        {
          selectExprTokens: SanitizeColumnNames<Ast["selectExprTokens"], Ast["tableRefTokens"][0]>;
          paramColumns: SanitizeColumnNames<Ast["paramColumns"], Ast["tableRefTokens"][0]>;
          index: 100;
        },
        Ast
      >
    : Ast["index"] extends 100 ?
      {
        inferredParamsType: InferParamsType<Ast["paramColumns"], Ast["tables"]>;
        inferredReturnType: InferReturnType<Ast["selectExprTokens"], Ast["tables"]>;
        ast: Ast;
      }
    : never
  : never;

export type InferParamsTypeFromSelectStatement<
  Query extends string,
  Tables extends TablesBase,
> = Object.ExpandRecursively<Parse<{ query: Query; tables: Tables }>["inferredParamsType"]>;

export type InferReturnTypeFromSelectStatement<
  Query extends string,
  Tables extends TablesBase,
> = Object.ExpandRecursively<Parse<{ query: Query; tables: Tables }>["inferredReturnType"]>[];
