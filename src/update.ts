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

import { InferParamsType } from "./utils";
import { Object, Array, TablesBase, Tokenize } from "./utils";
import { ParseParamsFromWhereClauseTokens } from "./where-condition";

export type IsUpdateStatement<Query extends string> = Uppercase<Query> extends `UPDATE ${string}` ? true : false;

export type ReturnTypeFromUpdateStatement = string;

/**
 * Parse the parameters from the SET clause tokens
 *
 * @example
 * type T0 = ParseParamsFromSetClauseTokens<["col1", "=", "?", ",", "col2", "=", "?"]>; // ["col1", "col2"]
 */
type ParseParamsFromSetClauseTokens<
  Tokens extends string[],
  ColumnName extends string = "",
  Params extends string[] = [],
> =
  Tokens extends [infer First extends string, ...infer Rest extends string[]] ?
    First extends "?" ? ParseParamsFromSetClauseTokens<Rest, ColumnName, [...Params, ColumnName]>
    : Rest extends ["=", ...infer Rest2 extends string[]] ? ParseParamsFromSetClauseTokens<Rest2, First, Params>
    : ParseParamsFromSetClauseTokens<Rest, ColumnName, Params>
  : Params;

type UpdateAst = {
  query: string;
  tables: TablesBase;
  tokens: string[];
  index: number;
  tblName: string;
  setClauseTokens: string[];
  whereClauseTokens: string[];
  paramColumns: string[];
};

type Parse<
  AstPatch extends Partial<UpdateAst>,
  AstState extends UpdateAst = {
    query: "";
    tables: {};
    tokens: [];
    index: 0;
    tblName: "";
    setClauseTokens: [];
    whereClauseTokens: [];
    paramColumns: [];
  },
> =
  Object.Overwrite<AstState, AstPatch> extends infer Ast extends UpdateAst ?
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
          tokens: Array.GetSliceFromFirstNonMatch<Ast["tokens"], "UPDATE" | "LOW_PRIORITY" | "IGNORE">;
          index: 2;
        },
        Ast
      >
    : Ast["index"] extends 2 ?
      Parse<
        {
          tblName: Ast["tokens"][0];
          tokens: Array.Shift<Ast["tokens"]>;
          index: 3;
        },
        Ast
      >
    : Ast["index"] extends 3 ?
      Parse<
        {
          setClauseTokens: Array.GetSliceBetween<Ast["tokens"], "SET", "WHERE" | "ORDER" | "LIMIT">;
          tokens: Array.GetSliceFromFirstNonMatch<Ast["tokens"], "WHERE" | "ORDER" | "LIMIT">;
          index: 4;
        },
        Ast
      >
    : Ast["index"] extends 4 ?
      Parse<
        {
          whereClauseTokens: Array.GetSliceBetween<Ast["tokens"], "WHERE", "ORDER" | "LIMIT">;
          tokens: Array.GetSliceFromFirstNonMatch<Ast["tokens"], "ORDER" | "LIMIT">;
          paramColumns: ParseParamsFromSetClauseTokens<Ast["setClauseTokens"]>;
          index: 5;
        },
        Ast
      >
    : Ast["index"] extends 5 ?
      Parse<
        {
          paramColumns: [...Ast["paramColumns"], ...ParseParamsFromWhereClauseTokens<Ast["whereClauseTokens"]>];
          index: 100;
        },
        Ast
      >
    : Ast["index"] extends 100 ?
      {
        inferredParamsType: InferParamsType<Ast["paramColumns"], Ast["tables"], Ast["tblName"]>;
        inferredReturnType: ReturnTypeFromUpdateStatement;
        ast: Ast;
      }
    : never
  : never;

export type InferParamsTypeFromUpdateStatement<
  Query extends string,
  Tables extends TablesBase,
> = Object.ExpandRecursively<Parse<{ query: Query; tables: Tables }>["inferredParamsType"]>;
