/**
 * This module provides type guards for dates type.
 *
 * @module   builtins.date
 * @author   Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license  MIT
 * @since    1.0.0
 */

import { isNaN, isString } from './primitive';

/**
 * Determines whether the provided value is a `Date` object.
 *
 * @remarks
 * This function checks only the type, not the validity of the date.
 * Invalid dates (e.g., `new Date('invalid')`) still return `true`.
 * For validating date, use {@linkcode isValidDate}.
 *
 * | Value                     | Result |
 * | ------------------------- | ------ |
 * | `new Date()`              | `true` |
 * | `new Date('invalid')`     | `true` |
 * | `'2026-04-10'`            | `false`|
 * | `Date.now()`              | `false`|
 * | `{}`                      | `false`|
 * | `null`                    | `false`|
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a `Date` object, otherwise `false`.
 *
 * @since 1.0
 * @see   {@link isValidDate}
 */
export function isDate(x: unknown): x is Date {
  return x instanceof Date;
}

/**
 * Determines whether the provided value is a valid `Date` object.
 *
 * @remarks
 * This function ensures that the value is a `Date` instance and that
 * its internal time value is valid (i.e., not `NaN`).
 *
 * | Value                     | Result  |
 * | ------------------------- | ------- |
 * | `new Date()`              | `true`  |
 * | `new Date('invalid')`     | `false` |
 * | `'2026-04-10'`            | `false` |
 * | `Date.now()`              | `false` |
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a valid `Date`, otherwise `false`.
 *
 * @since 1.0
 * @see   {@link isDate}
 */
export function isValidDate(x: unknown): x is Date {
  return isDate(x) && !isNaN(x.getTime());
}

/**
 * Determines whether the provided value is a valid ISO 8601 date string.
 *
 * @remarks
 * This function checks:
 * 1. The value is a string
 * 2. The string matches a simplified ISO 8601 format (only if `strict` is set to `false`)
 *     - `YYYY-MM-DDT` (acceptable if `strict` is set to `false`)
 *     - `YYYY-MM-DDTHH:mm:ss.sssZ`
 *     - `YYYY-MM-DDTHH:mm:ss.sss+HH:mm`
 *
 * | Value                          | Result Default      | Result Strict Mode |
 * | ------------------------------ | ------------------- | ------------------ |
 * | `'2026-04-10T12:00:00Z'`       | `true`              | `true`             |
 * | `'2026-04-10T12:00:00+07:00'`  | `true`              | `true`             |
 * | `'2026-04-10T-foo'`            | `true`              | `false`            |
 * | `'2026-04-10T'`                | `true`              | `false`            |
 * | `'2026-04-10'`                 | `false`             | `false`            |
 * | `'invalid-date'`               | `false`             | `false`            |
 * | `new Date().toISOString()`     | `true`              | `true`             |
 * | `123`                          | `false`             | `false`            |
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a valid ISO date string, otherwise `false`.
 *
 * @since 1.0
 */
export function isISODateString(x: unknown, strict?: boolean): x is string {
  if (!isString(x)) return false;

  const basicISORegex = /^\d{4}-\d{2}-\d{2}T/;
  const strictISORegex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

  if (strict) {
    if (!strictISORegex.test(x)) return false;
  } else {
    if (!basicISORegex.test(x)) return false;
  }

  // No validation here due to an issue if passing a simplified ISO 8601 date
  // to `Date` constuctor, which returns an error invalid date
  return true;
}

/**
 * Determines whether the provided value is a parseable date string.
 *
 * @remarks
 * This function checks whether a string can be parsed into a valid `Date`.
 * It is more permissive than {@linkcode isISODateString}, as it accepts
 * non-ISO formats supported by the JavaScript engine.
 *
 * **NOTE:** Parsing behavior may vary between environments.
 *
 * | Value              | Result |
 * | ------------------ | ------ |
 * | `'2026-04-10'`     | `true` |
 * | `'April 10, 2026'` | `true` |
 * | `'invalid'`        | `false`|
 * | `123`              | `false`|
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a parseable date string, otherwise `false`.
 *
 * @since 1.0
 * @see   {@link isISODateString}
 */
export function isDateString(x: unknown): x is string {
  if (!isString(x)) return false;

  return isValidDate(new Date(x));
}

// TODO: Add timestamp checks
