/**
 * @module   builtins.array
 * @author   Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license  MIT
 * @since    1.0.0
 */

import { isObject, isPlainObject } from './object';
import { isFunction } from './function';
import { isBigInt, isBoolean, isNumber, isString, isSymbol } from './primitive';

/**
 * Determines whether the provided value is an array.
 *
 * @remarks
 * This function performs a runtime check using `Array.isArray` and narrows
 * the value to `unknown[]`.
 *
 * It does not validate the types of the array elements. To ensure element
 * type safety, use {@linkcode isArrayOf}.
 *
 * | Value        | Result |
 * | ------------ | ------ |
 * | `[]`         | `true` |
 * | `[1, 2, 3]`  | `true` |
 * | `'text'`     | `false`|
 * | `{}`         | `false`|
 * | `null`       | `false`|
 * | `undefined`  | `false`|
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArrayOf}
 */
export function isArray(x: unknown): x is unknown[] {
  return Array.isArray(x);
}

/**
 * Determines whether the provided value is an array whose elements
 * satisfy the given predicate.
 *
 * @remarks
 * This function first checks if the value is an array, then validates
 * each element using the provided predicate.
 *
 * The predicate must be a type guard (`v is T`) to ensure correct
 * type narrowing.
 *
 * An empty array returns `true`, since no elements violate the predicate.
 *
 * | Value              | Predicate           | Result |
 * | ------------------ | ------------------- | ------ |
 * | `[1, 2, 3]`        | `isNumber`          | `true` |
 * | `[1, 'a']`         | `isNumber`          | `false`|
 * | `[]`               | `isNumber`          | `true` |
 * | `'text'`           | `isString`          | `false`|
 * | `{}`               | `isString`          | `false`|
 *
 * This function also supports union types checking:
 *
 * ```typescript
 * isArrayOf<string | number>(x, (v) => isString(v) || isNumber(v));
 * ```
 *
 * @typeParam T - The expected element type.
 * @param     x - The value to be checked.
 * @param     predicate - A type guard used to validate each element.
 *
 * @returns `true` if the value is an array and all elements satisfy
 *          the predicate, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArray}
 */
export function isArrayOf<T>(
  x: unknown,
  predicate: (v: typeof x) => v is T
): x is T[] {
  return isArray(x) && isFunction(predicate) && x.every(predicate);
}

/**
 * Determines whether the provided value is an array of strings.
 *
 * @remarks
 * This function is an alias for:
 *
 * ```typescript
 * isArrayOf<string>(x, isString);
 * ```
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of strings, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArrayOf}
 * @see   {@link isString}
 */
export function isStringArray(x: unknown): x is string[] {
  return isArrayOf<string>(x, isString);
}

/**
 * Determines whether the provided value is an array of numbers.
 *
 * @remarks
 * This function is an alias for:
 *
 * ```typescript
 * isArrayOf<number>(x, isNumber);
 * ```
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of numbers, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArrayOf}
 * @see   {@link isNumber}
 */
export function isNumberArray(x: unknown): x is number[] {
  return isArrayOf<number>(x, isNumber);
}

/**
 * Determines whether the provided value is an array of booleans.
 *
 * @remarks
 * This function is an alias for:
 *
 * ```typescript
 * isArrayOf<boolean>(x, isBoolean);
 * ```
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of booleans, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArrayOf}
 * @see   {@link isBoolean}
 */
export function isBooleanArray(x: unknown): x is boolean[] {
  return isArrayOf<boolean>(x, isBoolean);
}

/**
 * Determines whether the provided value is an array of `bigint`s.
 *
 * @remarks
 * This function is an alias for:
 *
 * ```typescript
 * isArrayOf<bigint>(x, isBigInt);
 * ```
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of `bigint`s, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArrayOf}
 * @see   {@link isBigInt}
 */
export function isBigIntArray(x: unknown): x is bigint[] {
  return isArrayOf<bigint>(x, isBigInt);
}

/**
 * Determines whether the provided value is an array of symbols.
 *
 * @remarks
 * This function is an alias for:
 *
 * ```typescript
 * isArrayOf<symbol>(x, isSymbol);
 * ```
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of symbols, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArrayOf}
 * @see   {@link isSymbol}
 */
export function isSymbolArray(x: unknown): x is symbol[] {
  return isArrayOf<symbol>(x, isSymbol);
}

/**
 * Determines whether the provided value is an array of functions.
 *
 * @remarks
 * This function is an alias for:
 *
 * ```typescript
 * isArrayOf<(...args: any[]) => unknown>(x, isFunction);
 * ```
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of functions, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArrayOf}
 * @see   {@link isFunction}
 */
export function isFunctionArray(
  x: unknown
): x is ((...args: any[]) => unknown)[] {
  return isArrayOf<(...args: any[]) => unknown>(x, isFunction);
}

/**
 * Determines whether the provided value is an array of objects.
 *
 * For checking whether an array contains only plain objects, use
 * {@linkcode isPlainObjectArray}.
 *
 * @remarks
 * This function is an alias for:
 *
 * ```typescript
 * isArrayOf<object>(x, isObject);
 * ```
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of objects, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArrayOf}
 * @see   {@link isObject}
 */
export function isObjectArray(x: unknown): x is object[] {
  return isArrayOf<object>(x, isObject);
}

/**
 * Determines whether the provided value is an array of plain objects.
 *
 * @remarks
 * This function is an alias for:
 *
 * ```typescript
 * isArrayOf<Record<PropertyKey, unknown>>(x, isPlainObject);
 * ```
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of plain objects, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isArray}
 * @see   {@link isPlainObject}
 */
export function isPlainObjectArray(
  x: unknown
): x is Record<PropertyKey, unknown>[] {
  return isArrayOf<Record<PropertyKey, unknown>>(x, isPlainObject);
}
