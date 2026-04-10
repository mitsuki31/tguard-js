/**
 * @module    typeguard
 * @author    Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license   MIT
 * @since     1.0.0
 */

/**
 * Type alias for primitive types.
 *
 * @since 1.0.0
 */
export type PrimitiveType =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined;

//#region Nullish

/**
 * Checks if a value is either `null` or `undefined` (i.e., "nullish").
 * This is a type guard that narrows the type to `null | undefined`.
 *
 * For checking if a value is `null`, use {@linkcode isNull}.
 * For checking if a value is `undefined`, use {@linkcode isUndefined}.
 *
 * @typeParam T - The type of the input value.
 * @param     x - The value to check.
 *
 * @returns `true` if the value is `null` or `undefined`, `false` otherwise.
 *
 * @example
 * ```typescript
 * let myVar: string | null = null;
 * if (isNullOrUndefined(myVar)) {
 *   // myVar is now typed as null | undefined
 * }
 * ```
 *
 * @since  1.0.0
 * @see    {@link isNull}
 * @see    {@link isUndefined}
 */
export function isNullOrUndefined(x: unknown): x is null | undefined {
  return isNull(x) || isUndefined(x);
}

/**
 * Alias for {@linkcode isNullOrUndefined}.
 *
 * Checks if a value is "nullish" (`null` or `undefined`).
 * This is a type guard that narrows the type to `null | undefined`.
 *
 * For checking if a value is `null`, use {@linkcode isNull}.
 * For checking if a value is `undefined`, use {@linkcode isUndefined}.
 *
 * @param     x - The value to check.
 *
 * @returns `true` if the value is `null` or `undefined`, `false` otherwise.
 *
 * @since 1.0.0
 * @see   {@link isNullOrUndefined}
 */
export function isNullish(x: unknown): x is null | undefined {
  return isNullOrUndefined(x);
}

/**
 * Checks if a value is neither `null` nor `undefined` (i.e., "non-nullish").
 * This is a type guard that narrows the type away from `null` and `undefined`.
 *
 * @typeParam T - The type of the input value.
 * @param     x - The value to check.
 *
 * @returns `true` if the value is not `null` and not `undefined`, `false` otherwise.
 *
 * @example
 * ```typescript
 * let myValue: string | null = "hello";
 * if (isNonNullish(myValue)) {
 *   // myValue is now typed as string
 * }
 * ```
 *
 * @since 1.0.0
 * @see   {@link isNullOrUndefined}
 */
export function isNonNullish<T>(x: T): x is NonNullable<T> {
  return !isNullOrUndefined(x);
}

/**
 * Checks if a value is strictly `null`.
 *
 * The value will be narrowed to `null` if the function returns `true`.
 *
 * @param x - The value to check.
 * @returns `true` if the value is `null`, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isNull(x: unknown): x is null {
  return x === null;
}

/**
 * Checks if a value is strictly `undefined`.
 *
 * The value will be narrowed to `undefined` if the function returns `true`.
 *
 * To negate — check if a value is "defined" — use {@linkcode isDefined}.
 *
 * @param x - The value to check.
 * @returns `true` if the value is `undefined`, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isDefined} - Use this function to check if a value is "defined".
 */
export function isUndefined(x: unknown): x is undefined {
  return typeof x === "undefined";
}

/**
 * Alias for {@linkcode isNonNullish}.
 *
 * Checks if a value is "defined" (i.e., not `null` and not `undefined`).
 * This is a type guard that narrows the type away from `null` and `undefined`.
 *
 * @typeParam T - The type of the input value.
 * @param     x - The value to check.
 *
 * @returns `true` if the value is not `null` and not `undefined`, `false` otherwise.
 *
 * @example
 * ```typescript
 * let myValue: string | null = "hello";
 * if (isDefined(myValue)) {
 *   // myValue is now typed as string
 * }
 * ```
 *
 * @since 1.0.0
 */
export function isDefined<T>(x: T): x is NonNullable<T> {
  return isNonNullish(x);
}

/**
 * Checks if an environment variable is defined and has a non-empty string value.
 *
 * @remarks
 * This function is specifically designed for checking `process.env` variables.
 * An environment variable is considered "defined" if it exists (is not `undefined`)
 * and its value is a non-empty string. An empty string (`""`) is treated as
 * "not defined" in this context, as is common for environment flags.
 *
 * @param envVar - The environment variable value to check.
 * @returns `true` if the given environment variable is a non-empty string, otherwise `false`.
 *
 * @example
 * ```bash
 * # Setting environment variables
 * env SOME_VAR="hello"
 * env EMPTY_VAR=""
 * ```
 *
 * Now, we can use `isEnvDefined` to check if an environment variable is defined
 * and has a non-empty string value.
 *
 * ```typescript
 * // Checking environment variables
 * isEnvDefined(process.env.SOME_VAR);   // true
 * isEnvDefined(process.env.EMPTY_VAR);  // false
 *
 * // Environment variable `UNDEFINED_VAR` is not set yet
 * isEnvDefined(process.env.UNDEFINED_VAR);  // false
 *
 * let myEnvVar: string | undefined = process.env.MY_FLAG;
 * if (isEnvDefined(myEnvVar)) {
 *   // myEnvVar is now safely typed as 'string' in this scope
 *   console.log(`My flag is set to: ${myEnvVar}`);
 * }
 * ```
 *
 * @since 1.0.0
 * @see   {@link isNonNullish} - Use this function to check if a value is "non-nullish".
 */
export function isEnvDefined(envVar: string | undefined): envVar is string {
  return typeof envVar === "string" && envVar !== "";
}

//#endregion
//#region Primitive

/**
 * Checks if a value is a primitive type.
 *
 * @remarks
 * This function is specifically designed for checking primitive types.
 * A primitive type is a type that is not an object or a function.
 *
 * | Value           | Type        | Result  |
 * | --------------- | ----------- | ------- |
 * | `null`          | `null`      | `true`  |
 * | `undefined`     | `undefined` | `true`  |
 * | `"hello"`       | `string`    | `true`  |
 * | `123`           | `number`    | `true`  |
 * | `123n`          | `bigint`    | `true`  |
 * | `true`          | `boolean`   | `true`  |
 * | `Symbol()`      | `symbol`    | `true`  |
 * | `[]`            | `array`     | `false` |
 * | `{}`            | `object`    | `false` |
 * | `function() {}` | `function`  | `false` |
 *
 * @param x - The value to check.
 * @returns `true` if the value is a primitive type, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isPrimitive(x: unknown): x is PrimitiveType {
  return x === null || (typeof x !== "object" && typeof x !== "function");
}

/**
 * Determines whether the provided value is a string.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a string, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isString(x: unknown): x is string {
  return typeof x === "string";
}

/**
 * Determines whether the provided value is a `number` (not a type of `bigint`).
 *
 * Use {@linkcode isBigInt} to check if a value is a `bigint`.
 *
 * |     Value     | Real Value |  Result  |
 * | ------------- | ---------- | -------- |
 * | `0`           | `0`        | `true`   |
 * | `1.0`         | `1`        | `true`   |
 * | `0xFFF`       | `4095`     | `true`   |
 * | `0b100`       | `4`        | `true`   |
 * | `1e5`         | `100000`   | `true`   |
 * | `NaN`         | `NaN`      | `true`   |
 * | `Infinity`    | `Infinity` | `true`   |
 * | `BigInt(1)`   | `1n`       | `false`  |
 * | `BigInt(0xE)` | `14n`      | `false`  |
 * | `1n`          | `1n`       | `false`  |
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a number, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isBigInt}
 * @see   {@link isFiniteNumber}
 */
export function isNumber(x: unknown): x is number {
  return typeof x === "number";
}

/**
 * Determines whether the provided value is a finite number.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a finite number, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isNumber}
 */
export function isFiniteNumber(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}

/**
 * Determines whether the provided value is a `bigint`.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a `bigint`, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isNumber}
 */
export function isBigInt(x: unknown): x is bigint {
  return typeof x === "bigint";
}

/**
 * Determines whether the provided value is a `boolean` (`true` or `false`).
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a `boolean`, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isBoolean(x: unknown): x is boolean {
  return typeof x === "boolean";
}

/**
 * Alias for {@linkcode isBoolean}.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a `boolean`, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isBoolean}
 */
export function isBool(x: unknown): x is boolean {
  return isBoolean(x);
}

//#endregion
//#region Array

/**
 * Determines whether the provided value is an array.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isArray<T = unknown>(x: unknown): x is T[] {
  return Array.isArray(x);
}

/**
 * Determines whether the provided value is an array of strings.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of strings, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArray}
 */
export function isStringArray(x: unknown): x is string[] {
  return isArray<string>(x) && x.every((v) => typeof v === "string");
}

/**
 * Determines whether the provided value is an array of numbers.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of numbers, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArray}
 */
export function isNumberArray(x: unknown): x is number[] {
  return isArray<number>(x) && x.every((v) => typeof v === "number");
}

/**
 * Determines whether the provided value is an array of booleans.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of booleans, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArray}
 */
export function isBooleanArray(x: unknown): x is boolean[] {
  return isArray<boolean>(x) && x.every((v) => typeof v === "boolean");
}

/**
 * Determines whether the provided value is an array of bigints.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of bigints, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArray}
 */
export function isBigIntArray(x: unknown): x is bigint[] {
  return isArray<bigint>(x) && x.every((v) => typeof v === "bigint");
}

/**
 * Determines whether the provided value is an array of symbols.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of symbols, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArray}
 */
export function isSymbolArray(x: unknown): x is symbol[] {
  return isArray<symbol>(x) && x.every((v) => typeof v === "symbol");
}

/**
 * Determines whether the provided value is an array of functions.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of functions, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArray}
 */
export function isFunctionArray(
  x: unknown,
): x is ((...args: any[]) => unknown)[] {
  return isArray<(...args: any[]) => unknown>(x) && x.every(isFunction);
}

/**
 * Determines whether the provided value is an array of objects.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of objects, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArray}
 */
export function isObjectArray(x: unknown): x is object[] {
  return isArray<object>(x) && x.every(isObject);
}

/**
 * Determines whether the provided value is an array of plain objects.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of plain objects, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArray}
 * @see   {@link isPlainObject}
 */
export function isPlainObjectArray(
  x: unknown,
): x is Record<PropertyKey, unknown>[] {
  return isArray<Record<PropertyKey, unknown>>(x) && x.every(isPlainObject);
}

//#endregion
//#region Object

/**
 * Determines whether the provided value is an object (excluding `null`).
 *
 * @remarks
 * This function returns `true` for any value whose `typeof` result is `"object"`
 * except `null`. This includes arrays, dates, maps, sets, and class instances.
 *
 * This function does NOT check whether a value is a plain object (`{}`).
 * Use {@linkcode isPlainObject} for that purpose.
 *
 * | Value        | Result  |
 * | ------------ | ------- |
 * | `{}`         | `true`  |
 * | `[]`         | `true`  |
 * | `new Date()` | `true`  |
 * | `new Map()`  | `true`  |
 * | `null`       | `false` |
 * | `undefined`  | `false` |
 * | `() => {}`   | `false` |
 * | `'text'`     | `false` |
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an object and not `null`.
 *
 * @since 1.0.0
 * @see   {@link isPlainObject}
 */
export function isObject(x: unknown): x is object {
  return x !== null && typeof x === "object";
}

/**
 * Determines whether the provided value is a plain object.
 *
 * @remarks
 * A plain object is an object created using:
 *
 * - Object literal (`{}`)
 * - `new Object()`
 * - `Object.create(null)`
 *
 * This function returns `false` for arrays, class instances,
 * built-in objects, and special object types.
 *
 * This function only narrows the top-level type and does not
 * validate nested properties.
 *
 * | Value                    | Result |
 * | ------------------------ | ------ |
 * | `{}`                     | `true` |
 * | `new Object()`           | `true` |
 * | `Object.create(null)`    | `true` |
 * | `[]`                     | `false`|
 * | `new Date()`             | `false`|
 * | `new Map()`              | `false`|
 * | `class A {}; new A()`    | `false`|
 * | `null`                   | `false`|
 * | `undefined`              | `false`|
 * | `() => ({})`             | `true` |
 *
 * @param x - The value to be checked.
 *
 * @returns `true` if the value is a plain object, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isObject}
 */
export function isPlainObject(x: unknown): x is Record<PropertyKey, unknown> {
  if (!isObject(x)) return false;
  let proto = Object.getPrototypeOf(x);
  return proto === Object.prototype || proto === null;
}

/**
 * Alias for {@linkcode isPlainObject}.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a plain object, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isPlainObject}
 */
export function isRecord(x: unknown): x is Record<PropertyKey, unknown> {
  return isPlainObject(x);
}

/**
 * Determines whether the provided value is an empty plain object.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an empty plain object, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isPlainObject}
 */
export function isEmptyObject(x: unknown): boolean {
  return isPlainObject(x) && Object.keys(x).length === 0;
}

//#endregion
//#region Function & Class

/**
 * Determines whether the provided value is a function.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a function, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isCallable}
 */
export function isFunction(x: unknown): x is (...args: any[]) => unknown {
  return typeof x === "function";
}

/**
 * Determines whether the provided value is an ES6 class constructor.
 *
 * This function can only confirm that a value is a class constructor at runtime.
 * It cannot determine the instance type of the class, so it does not narrow to
 * a specific class instance type.
 *
 * | Symbol                 | Value   |
 * | ---------------------- | ------- |
 * | `class {}`             | `true`  |
 * | `class A extends B {}` | `true`  |
 * | `function () {}`       | `false` |
 * | `function () {}.bind()`| `false` |
 * | `() => {}`             | `false` |
 * | `{}`                   | `false` |
 * | `URL`                  | `true`  |
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an ES6 class constructor, otherwise `false`.
 *
 * @since 1.0.0
 * @see {@link isCallable}
 */
export function isClass(x: unknown): x is new (...args: any[]) => unknown {
  return isFunction(x) && /^class\s/.test(Function.prototype.toString.call(x));
}

/**
 * Determines whether the provided value is callable.
 *
 * Callable values include normal functions, arrow functions, and bound functions.
 * ES6 class constructors are not callable without `new`, so this function returns
 * `false` for classes.
 *
 * | Symbol                 | Value   |
 * | ---------------------- | ------- |
 * | `function () {}`       | `true`  |
 * | `() => {}`             | `true`  |
 * | `function () {}.bind()`| `true`  |
 * | `class {}`             | `false` |
 * | `class A extends B {}` | `false` |
 * | `class A {}`           | `false` |
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is callable, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isFunction}
 * @see   {@link isClass}
 */
export function isCallable(x: unknown): x is (...args: any[]) => unknown {
  return isFunction(x) && !isClass(x);
}
