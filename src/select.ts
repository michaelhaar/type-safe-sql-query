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
import {
  ExpandRecursively,
  InferParamsType2,
  Overwrite,
  Slice,
  SliceBeforeFirstMatch,
  SliceFromFirstNonMatch,
  TODO,
  Tokenize,
} from "./utils";
import { ParseParamsFromWhereClauseTokens } from "./where-condition";

export type IsSelectStatement<Query extends string> = Query extends `SELECT ${string}` ? true : false;

export type ParseSelectStatement<Query extends string> =
  Query extends `SELECT ${infer SelectExpressionsString} FROM ${infer TableReferencesString}` ?
    {
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

type OtherKeyword = "GROUP BY" | "HAVING" | "WINDOW" | "ORDER BY" | "LIMIT" | "INTO" | "FOR";

type SelectAst = {
  query: string;
  tables: TODO;
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
    tables: TODO;
    tokens: [];
    index: 0;
    selectExprTokens: [];
    tableRefTokens: [];
    whereClauseTokens: [];
    paramColumns: [];
  },
> =
  Overwrite<AstState, AstPatch> extends infer Ast extends SelectAst ?
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
          tokens: SliceFromFirstNonMatch<
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
          selectExprTokens: SliceBeforeFirstMatch<Ast["tokens"], "INTO" | "FROM" | "WHERE" | OtherKeyword>;
          tableRefTokens: Slice<Ast["tokens"], "FROM", "WHERE" | OtherKeyword>;
          whereClauseTokens: Slice<Ast["tokens"], "WHERE", OtherKeyword>;
          index: 3;
        },
        Ast
      >
    : Ast["index"] extends 3 ?
      Parse<
        {
          paramColumns: ParseParamsFromWhereClauseTokens<Ast["whereClauseTokens"]>;
          index: 4;
        },
        Ast
      >
    : Ast["index"] extends 4 ?
      Parse<
        {
          paramColumns: SanitizeSelectExpressions<Ast["paramColumns"], Ast["tableRefTokens"][0]>;
          index: 100;
        },
        Ast
      >
    : Ast["index"] extends 100 ?
      {
        inferredParamsType: InferParamsType2<Ast["paramColumns"], Ast["tables"]>;
        inferredReturnType: TODO;
        ast: Ast;
      }
    : never
  : never;

export type InferParamsTypeFromSelectStatement<Query extends string, Tables extends TODO> = ExpandRecursively<
  Parse<{ query: Query; tables: Tables }>["inferredParamsType"]
>;
