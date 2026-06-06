/**
 * This module provides type guards for functions.
 *
 * @module   builtins.function
 * @author   Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license  MIT
 * @since    1.0.0
 */

import { toStringFunc } from '../internal/utils';

/**
 * Determines whether the provided value is a function.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a function, otherwise `false`.
 *
 * @since 1.0
 * @see   {@link isCallable}
 */
export function isFunction(x: unknown): x is (...args: any[]) => unknown {
  return typeof x === 'function';
}

/**
 * Determines whether the provided value is an ES6 class constructor.
 *
 * **Note:**\
 * Native constructors (`URL`, `Map`, etc.) are runtime-dependent and
 * may yield different results across environments.
 *
 * This behavior is due to engine implementation differences and
 * cannot be fully normalized without sacrificing correctness.
 *
 * @remarks
 * This function uses `Function.prototype.toString()` to check if the
 * value is a class constructor but it is **unstable** for native constructors.
 *
 * | Value                   | Result (Typical)  |
 * | ----------------------- | ----------------- |
 * | `class {}`              | `true`            |
 * | `class A extends B {}`  | `true`            |
 * | `function () {}`        | `false`           |
 * | `function () {}.bind()` | `false`           |
 * | `() => {}`              | `false`           |
 * | `{}`                    | `false`           |
 * | `URL`                   | runtime-dependent |
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an ES6 class constructor, otherwise `false`.
 *
 * @since 1.0
 * @see   {@link isCallable}
 */
export function isClass(x: unknown): x is new (...args: any[]) => unknown {
  return isFunction(x) && /^class\s/.test(toStringFunc.call(x));
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
 * @since 1.0
 * @see   {@link isFunction}
 * @see   {@link isClass}
 */
export function isCallable(x: unknown): x is (...args: any[]) => unknown {
  return isFunction(x) && !isClass(x);
}
