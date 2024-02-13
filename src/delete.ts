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
 *
 *
 * Not supported:
 * - currently only the single table syntax is supported
 * - PARTITION
 * - Alias
 */

import { InferParamsType } from "./utils";
import { Object, Array, TablesBase, Tokenize } from "./utils";
import { ParseParamsFromWhereClauseTokens } from "./where-condition";

export type IsDeleteStatement<Query extends string> = Uppercase<Query> extends `DELETE ${infer _Rest}` ? true : false;

export type ReturnTypeFromDeleteStatement = string;

type DeleteAst = {
  query: string;
  tables: TablesBase;
  tokens: string[];
  index: number;
  tblName: string;
  whereClauseTokens: string[];
  paramColumns: string[];
};

type Parse<
  AstPatch extends Partial<DeleteAst>,
  AstState extends DeleteAst = {
    query: "";
    tables: {};
    tokens: [];
    index: 0;
    tblName: "";
    whereClauseTokens: [];
    paramColumns: [];
  },
> =
  Object.Overwrite<AstState, AstPatch> extends infer Ast extends DeleteAst ?
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
            "DELETE" | "LOW_PRIORITY" | "QUICK" | "IGNORE" | "FROM"
          >;
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
          whereClauseTokens: Array.GetSliceBetween<Ast["tokens"], "WHERE", "ORDER BY" | "LIMIT">;
          tokens: Array.GetSliceFromFirstMatch<Ast["tokens"], "WHERE">;
          index: 4;
        },
        Ast
      >
    : Ast["index"] extends 4 ?
      Parse<
        {
          paramColumns: ParseParamsFromWhereClauseTokens<Ast["whereClauseTokens"]>;
          index: 100;
        },
        Ast
      >
    : Ast["index"] extends 100 ?
      {
        inferredParamsType: InferParamsType<Ast["paramColumns"], Ast["tables"], Ast["tblName"]>;
        inferredReturnType: ReturnTypeFromDeleteStatement;
        ast: Ast;
      }
    : never
  : never;

export type InferParamsTypeFromDeleteStatement<
  Query extends string,
  Tables extends TablesBase,
> = Object.ExpandRecursively<
  Parse<{
    query: Query;
    tables: Tables;
  }>["inferredParamsType"]
>;
