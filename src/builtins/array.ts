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

//#region Structure Checks

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
 * @since 1.0
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
 * @since 1.0
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
 * Homogeneous tuple check:
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
 * @param predicate - A predicate used to validate the tuple elements.
 *
 * @returns `true` if the value satisfies the tuple structure, otherwise `false`.
 *
 * @since 1.1
 */
export function isTuple<T>(
  x: unknown,
  predicate: Predicate<T>
): x is readonly [T, ...T[]];

/**
 * {@inheritDoc}
 *
 * @typeParam T - The tuple type inferred from the predicate list.
 *
 * @param x - The value to validate.
 * @param predicates - Predicates used to validate each tuple position.
 *
 * @since   1.1
 */
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
 * ...but rejects empty arrays.
 *
 * Use {@linkcode isArrayOf} if empty arrays should be considered valid.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of strings, otherwise `false`.
 *
 * @since 1.0
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
 * ...but rejects empty arrays.
 *
 * Use {@linkcode isArrayOf} if empty arrays should be considered valid.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of numbers, otherwise `false`.
 *
 * @since 1.0
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
 * ...but rejects empty arrays.
 *
 * Use {@linkcode isArrayOf} if empty arrays should be considered valid.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of booleans, otherwise `false`.
 *
 * @since 1.0
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
 * ...but rejects empty arrays.
 *
 * Use {@linkcode isArrayOf} if empty arrays should be considered valid.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of `bigint`s, otherwise `false`.
 *
 * @since 1.0
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
 * ...but rejects empty arrays.
 *
 * Use {@linkcode isArrayOf} if empty arrays should be considered valid.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of symbols, otherwise `false`.
 *
 * @since 1.0
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
 * ...but rejects empty arrays.
 *
 * Use {@linkcode isArrayOf} if empty arrays should be considered valid.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of functions, otherwise `false`.
 *
 * @since 1.0
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
 * ...but rejects empty arrays.
 *
 * Use {@linkcode isArrayOf} if empty arrays should be considered valid.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of objects, otherwise `false`.
 *
 * @since 1.0
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
 * ...but rejects empty arrays.
 *
 * Use {@linkcode isArrayOf} if empty arrays should be considered valid.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an array of plain objects, otherwise `false`.
 *
 * @since 1.0
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

//#endregion
//#region Semantic Checks

/**
 * Determines whether the provided array contains only unique values.
 *
 * @remarks
 * This function checks for duplicate entries using JavaScript `Set`
 * semantics (`SameValueZero` equality).
 *
 * This means:
 *
 * - primitive values are compared by value
 * - object values are compared by reference identity
 * - `NaN` is considered equal to `NaN`
 *
 * ### Implementation Notes
 *
 * - This function does not perform deep equality comparison.
 * - Arrays containing structurally equal but different object references
 *   are considered unique.
 *
 * @example
 * Unique primitive values:
 *
 * ```typescript
 * isUniqueArray([1, 2, 3]); // true
 * ```
 *
 * Duplicate primitive values:
 *
 * ```typescript
 * isUniqueArray([1, 2, 1]); // false
 * ```
 *
 * Object references:
 *
 * ```typescript
 * const a = {};
 * const b = {};
 *
 * isUniqueArray([a, b]); // true
 * isUniqueArray([a, a]); // false
 * ```
 *
 * `NaN` handling:
 *
 * ```typescript
 * isUniqueArray([NaN, NaN]); // false
 * ```
 *
 * Empty arrays will returns `true` because there's no duplicate elements:
 *
 * ```typescript
 * isUniqueArray([]); // true
 * ```
 *
 * A better way if want to check if the array is unique and is not empty:
 *
 * ```typescript
 * if (!isEmptyArray(arr) && isUniqueArray(arr)) {
 *   // ...
 * }
 * ```
 *
 * @param x - The value to validate.
 *
 * @returns `true` if the array contains no duplicate entries, otherwise `false`.
 *
 * @since 1.1
 */
export function isUniqueArray(x: unknown): x is unknown[] {
  if (!isArray(x)) return false;

  const copy = new Set(x);
  return copy.size === x.length;
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
 * @since 1.0
 */
export function isEmptyArray(x: unknown): x is [] {
  return isArray(x) && x.length === 0;
}

/**
 * Determine whether a value is a "dense" JavaScript array.
 *
 * A dense array, for the purposes of this function, is an array that:
 * - is actually an array (`Array.isArray` equivalent), and
 * - has exactly as many own enumerable keys as its `length` property.
 *
 * In practice this means:
 * - Arrays with "holes" (e.g. created with `new Array(n)` or by leaving indices unset) are not dense.
 * - Arrays with additional enumerable own properties (e.g. `arr.foo = 1`) are not dense.
 * - Elements explicitly set to `undefined` still count as entries and do not make the array sparse.
 *
 * @example
 * ```javascript
 * // true: empty array has 0 keys and length 0
 * isDenseArray([]); // true
 *
 * // true: element explicitly set (even if undefined) counts as an entry
 * isDenseArray([undefined]); // true
 *
 * // false: "hole" at index 0 -> keys.length (0) !== length (1)
 * isDenseArray(new Array(1)); // false
 *
 * // false: extra enumerable property increases keys.length beyond length
 * const a = [1];
 * a.foo = 'bar';
 * isDenseArray(a); // false
 * ```
 *
 * @param x - The value to test.
 *
 * @returns `true` if `x` is an array and the number of its own enumerable keys
 *          equals its `length`; otherwise `false`.
 *
 * @since 1.1
 */
export function isDenseArray(x: unknown): x is unknown[] {
  return isArray(x) && Object.keys(x).length === x.length;
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
 * @since 1.0
 */
export function isReadonlyArray(x: unknown): x is readonly unknown[] {
  return isArray(x) && Object.isFrozen(x);
}

//#endregion
//#region 2D Arrays

/**
 * Determines whether the provided value is a two-dimensional array.
 *
 * @remarks
 * A value is considered a 2D array if:
 *
 * - it is an array
 * - every element is also an array
 *
 * The inner array element types are not validated.
 *
 * ### Examples
 *
 * | Value               | Result  |
 * | ------------------- | ------- |
 * | `[]`                | `false` |
 * | `[[]]`              | `true`  |
 * | `[[1, 2], [3]]`     | `true`  |
 * | `[['a'], [1]]`      | `true`  |
 * | `[1, 2, 3]`         | `false` |
 * | `{}`                | `false` |
 * | `null`              | `false` |
 *
 * ### Implementation Notes
 *
 * - Empty two-dimensional array are considered valid.
 * - Inner arrays may contain values of any type.
 * - This function checks only array nesting depth, not contents.
 *
 * @param x - The value to validate.
 * @returns `true` if the value is a two-dimensional array.
 *
 * @since 1.1
 *
 * @see {@link isMatrix}
 */
export function is2DArray(x: unknown): x is unknown[][] {
  if (!isArray(x)) return false;
  if (x.length === 0) return false;

  for (const val of x) {
    // Strictly return false if one of them is not an array
    if (!isArray(val)) return false;
  }

  return true;
}

/**
 * Determines whether the provided value is a numeric matrix.
 *
 * > In mathematics, a matrix is a rectangular array of numbers
 * > or other mathematical objects with elements or entries arranged
 * > in rows and columns.
 * >
 * > From Wikipedia (https://en.wikipedia.org/wiki/Matrix_(mathematics)).
 *
 * @remarks
 * A value is considered a matrix if:
 *
 * - it is an array
 * - every element is an array
 * - every nested value is a number
 *
 * ### Examples
 *
 * | Value                  | Result  |
 * | ---------------------- | ------- |
 * | `[]`                   | `false` |
 * | `[[]]`                 | `true`  |
 * | `[[1, 2], [3, 4]]`     | `true`  |
 * | `[[1], [2], [3]]`      | `true`  |
 * | `[[1], [2, 3]]`        | `false` |
 * | `[[1], ['a']]`         | `false` |
 * | `[1, 2]`               | `false` |
 * | `{}`                   | `false` |
 *
 * @param x - The value to validate.
 * @returns `true` if the value is an array of number arrays.
 *
 * @since 1.1
 *
 * @see {@link is2DArray}
 */
export function isMatrix(x: unknown): x is number[][] {
  if (!is2DArray(x)) return false;

  let cols = -1;
  for (const row of x) {
    // Reject for sparse rows
    if (!isDenseArray(row)) return false;

    // Matrix entries must be number type
    if (!row.every((v) => isNumber(v))) return false;

    if (cols === -1) {
      cols = row.length;
    } else if (cols !== row.length) {
      return false;
    }
  }

  return true;
}

//#endregion
