/**
 * Overwrite properties of an object with another object
 *
 * @example
 * type T0 = Overwrite<{ a: string, b: number }, { a: number }>; // { a: number, b: number }
 */
export type Overwrite<O extends object, O1 extends object> = {
  [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};

/**
 * Util to expand computed TypeScript types on hover
 * see: https://github.com/microsoft/vscode/issues/94679
 * see: https://stackoverflow.com/a/57683652
 */
export type ExpandRecursively<T> =
  T extends object ?
    T extends infer O ?
      { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;
