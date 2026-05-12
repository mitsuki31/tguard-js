/**
 * This module provides type guards for primitive types (including nullish).
 *
 * @module    builtins.primitive
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
 * | `'hello'`       | `string`    | `true`  |
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
  return x === null || (typeof x !== 'object' && typeof x !== 'function');
}

//#region String

/**
 * Determines whether the provided value is a string.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a string, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isString(x: unknown): x is string {
  return typeof x === 'string';
}

/**
 * Determines whether the provided value is a string containing only
 * ASCII characters.
 *
 * @remarks
 * This function validates that all characters in the string fall within
 * the ASCII range (`0x00` to `0x7F`), including control characters.
 *
 * This includes:
 *
 * - printable characters (`A-Z`, `a-z`, `0-9`, punctuation)
 * - control characters (`\n`, `\r`, `\t`, etc.)
 * - null character (`\0`)
 *
 * @example
 * Valid ASCII strings:
 *
 * ```typescript
 * isASCIIString('hello'); // true
 * isASCIIString('hello\n'); // true
 * isASCIIString(''); // true
 * ```
 *
 * Invalid non-ASCII strings:
 *
 * ```typescript
 * isASCIIString('こんにちは'); // false
 * isASCIIString('café'); // false
 * isASCIIString('✓'); // false
 * ```
 *
 * @param x - The value to validate.
 * @returns `true` if the value is a string containing only ASCII characters.
 *
 * @since 1.1.0
 * @see   {@link isPrintableASCIIString}
 */
export function isASCIIString(x: unknown): x is string {
  if (!isString(x)) return false;
  return /^[\x00-\x7F]*$/.test(x);
}

/**
 * Determines whether the provided value is a string containing only
 * printable ASCII characters.
 *
 * @remarks
 * This function validates that all characters fall within the printable
 * ASCII range (`0x20` to `0x7E`).
 *
 * This excludes:
 *
 * - control characters (`\n`, `\r`, `\t`)
 * - null character (`\0`)
 * - non-ASCII Unicode characters
 *
 * @example
 * Valid printable ASCII strings:
 *
 * ```typescript
 * isPrintableASCIIString('hello'); // true
 * isPrintableASCIIString('Hello 123!'); // true
 * isPrintableASCIIString(''); // true
 * ```
 *
 * Invalid strings:
 *
 * ```typescript
 * isPrintableASCIIString('hello\n'); // false
 * isPrintableASCIIString('\ttext'); // false
 * isPrintableASCIIString('é'); // false
 * ```
 *
 * @param x - The value to validate.
 * @returns `true` if the value is a string containing only printable ASCII characters.
 *
 * @since 1.1.0
 * @see   {@link isASCIIString}
 */
export function isPrintableASCIIString(x: unknown): x is string {
  if (!isString(x)) return false;
  return /^[\x20-\x7E]*$/.test(x);
}

//#endregion
//#region Number

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
 * @see   {@link isFinite}
 */
export function isNumber(x: unknown): x is number {
  return typeof x === 'number';
}

/**
 * Determines whether the provided value is a finite number.
 *
 * | Value        | Result  |
 * | ------------ | ------- |
 * | `1`          | `true`  |
 * | `1.0`        | `true`  |
 * | `0xFFF`      | `true`  |
 * | `0b100`      | `true`  |
 * | `1e5`        | `true`  |
 * | `NaN`        | `false` |
 * | `Infinity`   | `false` |
 * | `-Infinity`  | `false` |
 * | `BigInt(1)`  | `false` |
 * | `1n`         | `false` |
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a finite number, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isNumber}
 */
export function isFinite(x: unknown): x is number {
  if (!isNumber(x)) return false;
  return Number.isFinite(x);
}

/**
 * Determines whether the provided value is an infinite number.
 *
 * @remarks
 * Infinite numbers can be created by `Infinity`, `-Infinity`, or `1 / 0`.
 *
 * | Value        | Result  |
 * | ------------ | ------- |
 * | `Infinity`   | `true`  |
 * | `-Infinity`  | `true`  |
 * | `1 / 0`      | `true`  |
 * | `1`          | `false` |
 * | `NaN`        | `false` |
 * | `'Infinity'` | `false` |
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an infinite number, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isFinite}
 */
export function isInfinite(x: unknown): x is number {
  if (!isNumber(x) || isNaN(x)) return false;
  return !isFinite(x);
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
  return typeof x === 'bigint';
}

/**
 * Determines whether the provided value is `NaN`.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is `NaN`, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isNaN(x: unknown): x is number {
  return isNumber(x) && Number.isNaN(x);
}

//#endregion
//#region Boolean

/**
 * Determines whether the provided value is a `boolean` (`true` or `false`).
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a `boolean`, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isBoolean(x: unknown): x is boolean {
  return typeof x === 'boolean';
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
//#region Symbol

/**
 * Determines whether the provided value is a `symbol`.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a `symbol`, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isSymbol(x: unknown): x is symbol {
  return typeof x === 'symbol';
}

//#endregion
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
  return typeof x === 'undefined';
}

/**
 * Alias for {@linkcode isNonNullish}.
 *
 * Checks if a value is "defined" (i.e., not `null` and not `undefined`).
 * This is a type guard that narrows the type away from `null` and `undefined`.
 *
 * @remarks
 * This function is different from {@linkcode envs.env.isEnvDefined | isEnvDefined}.
 * {@linkcode envs.env.isEnvDefined | isEnvDefined} checks if an environment variable is
 * defined and has a non-empty string value.
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

//#endregion
