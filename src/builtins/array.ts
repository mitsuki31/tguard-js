/**
 * @module   builtins.array
 * @author   Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license  MIT
 * @since    1.0.0
 */

import { isObject, isPlainObject } from './object';
import { isFunction } from './function';
import { isBigInt, isBoolean, isNumber, isString, isSymbol } from './primitive';

type Predicate<T> = (value: unknown) => value is T;

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
 * | `'text'`           | `isString`          | `true` |
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
export function isArrayOf<T>(x: unknown, predicate: Predicate<T>): x is T[] {
  return isArray(x) && isFunction(predicate) && x.every(predicate);
}

/**
 * Determines whether the provided value is a tuple whose entries
 * satisfy the given predicates in positional order.
 *
 * @remarks
 * This function performs strict tuple validation by ensuring:
 *
 * - the value is an array
 * - the array length exactly matches the predicate count
 * - each element satisfies the predicate at the same index
 *
 * Unlike {@linkcode isArrayOf}, tuple validation is positional and supports
 * heterogeneous element types.
 *
 * ### Implementation Notes
 *
 * - Tuple validation is strict and positional.
 * - Extra or missing elements will cause validation to fail.
 * - Predicates are evaluated in order.
 * - At runtime, tuples are validated as standard JavaScript arrays.
 *
 * @example
 * Validate a string-number tuple:
 *
 * ```typescript
 * isTuple(
 *   ['hello', 123],
 *   [isString, isNumber]
 * ); // true
 * ```
 *
 * Heterogeneous check:
 *
 * ```typescript
 * isTuple(
 *   ['foo', 'bar', '__not_foo_'],
 *   isString
 * ); // true
 * ```
 *
 * Invalid tuple length:
 *
 * ```typescript
 * isTuple(
 *   ['hello', 123, true],
 *   [isString, isNumber]
 * ); // false
 * ```
 *
 * Invalid tuple ordering:
 *
 * ```typescript
 * isTuple(
 *   [123, 'hello'],
 *   [isString, isNumber]
 * ); // false
 * ```
 *
 * Empty tuple:
 *
 * ```typescript
 * isTuple([], []); // true
 * ```
 *
 * @typeParam T - The tuple type inferred from the predicate list.
 *
 * @param x - The value to validate.
 * @param predicates - Predicates used to validate each tuple position.
 *
 * @returns `true` if the value satisfies the tuple structure, otherwise `false`.
 *
 * @since 1.1.0
 */
export function isTuple<T>(
  x: unknown,
  predicate: Predicate<T>
): x is readonly [T, ...T[]];

export function isTuple<T extends readonly unknown[]>(
  x: unknown,
  predicates: readonly [...{ [K in keyof T]: Predicate<T[K]> }]
): x is T;

export function isTuple(
  x: unknown,
  predicates: Predicate<unknown> | readonly Predicate<unknown>[]
): boolean {
  if (!isArray(x)) return false;

  // Single predicate -> homogeneous tuple/array
  if (isFunction(predicates)) {
    if (x.length === 0) return false;
    return x.every((v) => predicates(v));
  }

  // Tuple predicates
  if (x.length !== predicates.length) {
    return false;
  }

  for (let i = 0; i < predicates.length; i++) {
    if (!predicates[i](x[i])) return false;
  }

  return true;
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
  return !isEmptyArray(x) && isArrayOf<string>(x, isString);
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
  return !isEmptyArray(x) && isArrayOf<number>(x, isNumber);
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
  return !isEmptyArray(x) && isArrayOf<boolean>(x, isBoolean);
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
  return !isEmptyArray(x) && isArrayOf<bigint>(x, isBigInt);
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
  return !isEmptyArray(x) && isArrayOf<symbol>(x, isSymbol);
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
  return (
    !isEmptyArray(x) && isArrayOf<(...args: any[]) => unknown>(x, isFunction)
  );
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
  return !isEmptyArray(x) && isArrayOf<object>(x, isObject);
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
  return (
    !isEmptyArray(x) &&
    isArrayOf<Record<PropertyKey, unknown>>(x, isPlainObject)
  );
}

/**
 * Determines whether the provided value is an empty array.
 *
 * | Value | Result |
 * | ----- | ------ |
 * | `[]`  | `true` |
 * | `[1]` | `false`|
 * | `[,]` | `false`|
 * | `{}`  | `false`|
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an empty array, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isEmptyArray(x: unknown): x is [] {
  return isArray(x) && x.length === 0;
}

/**
 * Determines whether the provided value is a readonly array.
 *
 * @remarks
 * This function checks if the value is an array and if it is frozen.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a readonly array, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isReadonlyArray(x: unknown): x is readonly unknown[] {
  return isArray(x) && Object.isFrozen(x);
}
