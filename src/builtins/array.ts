/**
 * @module   builtins.array
 * @author   Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license  MIT
 * @since    1.0.0
 */

import { isObject, isPlainObject } from './object';
import { isFunction } from './function';

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
  return isArray<string>(x) && x.every((v) => typeof v === 'string');
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
  return isArray<number>(x) && x.every((v) => typeof v === 'number');
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
  return isArray<boolean>(x) && x.every((v) => typeof v === 'boolean');
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
  return isArray<bigint>(x) && x.every((v) => typeof v === 'bigint');
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
  return isArray<symbol>(x) && x.every((v) => typeof v === 'symbol');
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
  x: unknown
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
  x: unknown
): x is Record<PropertyKey, unknown>[] {
  return isArray<Record<PropertyKey, unknown>>(x) && x.every(isPlainObject);
}
