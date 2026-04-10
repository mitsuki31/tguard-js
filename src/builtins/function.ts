/**
 * This module provides type guards for functions.
 *
 * @module   builtins.function
 * @author   Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license  MIT
 * @since    1.0.0
 */

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
  return typeof x === 'function';
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
