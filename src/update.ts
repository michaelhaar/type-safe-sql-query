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

import { InferParamsType } from "./insert";
import { ExpandRecursively, Overwrite, Shift, Slice, SliceFromFirstNonMatch, TODO, Tokenize } from "./utils";
import { ParseParamsFromWhereConditionTokens } from "./where-condition";

export type IsUpdateStatement<Query extends string> = Query extends `UPDATE ${string}` ? true : false;

export type ReturnTypeFromUpdateStatement = string;

type UpdateAst = {
  query: string;
  tables: TODO;
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
    tables: TODO;
    tokens: [];
    index: 0;
    tblName: "";
    setClauseTokens: [];
    whereClauseTokens: [];
    paramColumns: [];
  },
> =
  Overwrite<AstState, AstPatch> extends infer Ast extends UpdateAst ?
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
          tokens: SliceFromFirstNonMatch<Ast["tokens"], "UPDATE" | "LOW_PRIORITY" | "IGNORE">;
          index: 2;
        },
        Ast
      >
    : Ast["index"] extends 2 ?
      Parse<
        {
          tblName: Ast["tokens"][0];
          tokens: Shift<Ast["tokens"]>;
          index: 3;
        },
        Ast
      >
    : Ast["index"] extends 3 ?
      Parse<
        {
          setClauseTokens: Slice<Ast["tokens"], "SET", "WHERE" | "ORDER" | "LIMIT">;
          tokens: SliceFromFirstNonMatch<Ast["tokens"], "WHERE" | "ORDER" | "LIMIT">;
          index: 4;
        },
        Ast
      >
    : Ast["index"] extends 4 ?
      Parse<
        {
          whereClauseTokens: Slice<Ast["tokens"], "WHERE", "ORDER" | "LIMIT">;
          tokens: SliceFromFirstNonMatch<Ast["tokens"], "ORDER" | "LIMIT">;
          index: 5;
        },
        Ast
      >
    : Ast["index"] extends 5 ?
      Parse<
        {
          paramColumns: ParseParamsFromWhereConditionTokens<Ast["whereClauseTokens"]>;
          index: 100;
        },
        Ast
      >
    : Ast["index"] extends 100 ?
      {
        inferredParamsType: InferParamsType<Ast["tblName"], Ast["paramColumns"], Ast["tables"]>;
        inferredReturnType: ReturnTypeFromUpdateStatement;
        ast: Ast;
      }
    : never
  : never;

export type InferParamsTypeFromUpdateStatement<Query extends string, Tables extends TODO> = ExpandRecursively<
  Parse<{ query: Query; tables: Tables }>["inferredParamsType"]
>;
