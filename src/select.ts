export type ExtractTableName<Query extends string> = Query extends `select ${infer _Columns} from ${infer TableName}`
  ? TableName
  : Query extends `SELECT ${infer _Columns} FROM ${infer TableName}`
    ? TableName
    : never;
