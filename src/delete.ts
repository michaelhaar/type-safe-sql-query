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

import { InferParamsType } from "./insert";
import {
  ExpandRecursively,
  Overwrite,
  Shift,
  Slice,
  SliceFromFirstMatch,
  SliceFromFirstNonMatch,
  TODO,
  Tokenize,
} from "./utils";
import { ParseParamsFromWhereConditionTokens } from "./where-condition";

export type IsDeleteStatement<Query extends string> = Query extends `DELETE ${infer _Rest}` ? true : false;

export type ReturnTypeFromDeleteStatement = string;

type DeleteAst = {
  query: string;
  tables: TODO;
  tokens: string[];
  index: number;
  from: string; // TODO: rename to tblName
  whereConditionTokens: string[];
  paramColumns: string[];
};

type Parse<
  AstPatch extends Partial<DeleteAst>,
  AstState extends DeleteAst = {
    query: "";
    tables: TODO;
    tokens: [];
    index: 0;
    from: "";
    whereConditionTokens: [];
    paramColumns: [];
  },
> =
  Overwrite<AstState, AstPatch> extends infer Ast extends DeleteAst ?
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
          tokens: SliceFromFirstNonMatch<Ast["tokens"], "DELETE" | "LOW_PRIORITY" | "QUICK" | "IGNORE" | "FROM">;
          index: 2;
        },
        Ast
      >
    : Ast["index"] extends 2 ?
      Parse<
        {
          from: Ast["tokens"][0];
          tokens: Shift<Ast["tokens"]>;
          index: 3;
        },
        Ast
      >
    : Ast["index"] extends 3 ?
      Parse<
        {
          whereConditionTokens: Slice<Ast["tokens"], "WHERE", "ORDER BY" | "LIMIT">;
          tokens: SliceFromFirstMatch<Ast["tokens"], "WHERE">;
          index: 4;
        },
        Ast
      >
    : Ast["index"] extends 4 ?
      Parse<
        {
          paramColumns: ParseParamsFromWhereConditionTokens<Ast["whereConditionTokens"]>;
          index: 100;
        },
        Ast
      >
    : Ast["index"] extends 100 ?
      {
        inferredParamsType: InferParamsType<Ast["from"], Ast["paramColumns"], Ast["tables"]>;
        inferredReturnType: ReturnTypeFromDeleteStatement;
        ast: Ast;
      }
    : never
  : never;

export type InferParamsTypeFromDeleteStatement<Query extends string, Tables extends TODO> = ExpandRecursively<
  Parse<{
    query: Query;
    tables: Tables;
  }>["inferredParamsType"]
>;
