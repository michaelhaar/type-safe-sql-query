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
 *
 *
 * Not supported:
 * - currently only first form is supported
 * - PARTITION
 * - alias
 * - ON DUPLICATE KEY UPDATE
 */

import {
  ExpandRecursively,
  FilterOut,
  Overwrite,
  Shift,
  Slice,
  SliceBeforeFirstMatch,
  SliceFromFirstMatch,
  SliceFromFirstNonMatch,
  TODO,
  Tokenize,
} from "./utils";

export type IsInsertStatement<Query extends string> = Query extends `INSERT ${string}` ? true : false;

export type ReturnTypeFromInsertStatement = string;

type GetParamColumns<Columns extends string[], Values extends string[], ParamColumns extends string[] = []> =
  Values extends [infer FirstValue extends string, ...infer RestValues extends string[]] ?
    Columns extends [infer FirstColumn extends string, ...infer RestColumns extends string[]] ?
      FirstValue extends "?" ?
        GetParamColumns<RestColumns, RestValues, [...ParamColumns, FirstColumn]>
      : GetParamColumns<RestColumns, RestValues, ParamColumns>
    : ParamColumns
  : ParamColumns;

// TODO: move to utils?
export type InferParamsType<Table extends string, ParamColumns extends string[], Tables> =
  Table extends keyof Tables ?
    ParamColumns extends [infer First, ...infer Rest extends string[]] ?
      First extends keyof Tables[Table] ?
        [Tables[Table][First], ...InferParamsType<Table, Rest, Tables>]
      : [never, ...InferParamsType<Table, Rest, Tables>]
    : []
  : [];

type InsertAst = {
  query: string;
  tables: TODO;
  tokens: string[];
  index: number;
  into: string;
  columns: string[];
  values: string[];
  paramColumns: string[];
};

type Parse<
  AstPatch extends Partial<InsertAst>,
  AstState extends InsertAst = {
    query: "";
    tables: TODO;
    tokens: [];
    index: 0;
    into: "";
    columns: [];
    values: [];
    paramColumns: [];
  },
> =
  Overwrite<AstState, AstPatch> extends infer Ast extends InsertAst ?
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
            "INSERT" | "LOW_PRIORITY" | "DELAYED" | "HIGH_PRIORITY" | "IGNORE" | "INTO"
          >;
          index: 2;
        },
        Ast
      >
    : Ast["index"] extends 2 ?
      Parse<
        {
          into: Ast["tokens"][0];
          tokens: Shift<Ast["tokens"]>;
          index: 3;
        },
        Ast
      >
    : Ast["index"] extends 3 ?
      Parse<
        {
          columns: FilterOut<SliceBeforeFirstMatch<Ast["tokens"], "VALUES" | "VALUE">, "(" | ")">;
          tokens: SliceFromFirstMatch<Ast["tokens"], "VALUES" | "VALUE">;
          index: 4;
        },
        Ast
      >
    : Ast["index"] extends 4 ?
      Parse<
        {
          values: FilterOut<Slice<Ast["tokens"], "VALUES" | "VALUE", "AS" | "ON">, "VALUES" | "VALUE" | "(" | ")">;
          tokens: SliceFromFirstMatch<Ast["tokens"], "AS" | "ON">;
          index: 5;
        },
        Ast
      >
    : Ast["index"] extends 5 ?
      Parse<
        {
          paramColumns: GetParamColumns<Ast["columns"], Ast["values"]>;
          index: 100;
        },
        Ast
      >
    : Ast["index"] extends 100 ?
      {
        inferredParamsType: InferParamsType<Ast["into"], Ast["paramColumns"], Ast["tables"]>;
        inferredReturnType: ReturnTypeFromInsertStatement;
        ast: Ast;
      }
    : never
  : never;

export type InferParamsTypeFromInsertStatement<Query extends string, Tables extends TODO> = ExpandRecursively<
  Parse<{
    query: Query;
    tables: Tables;
  }>["inferredParamsType"]
>;
