/**
 * Contains shared utilities for internal use only.
 *
 * @module    internal.utils
 * @author    Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license   MIT
 * @since     1.0.0
 */

/**
 * A cached reference to `Object.prototype.toString`.
 *
 * @private
 */
export const toString = Object.prototype.toString;

/**
 * A cached reference to `Function.prototype.toString`.
 *
 * @private
 */
export const toStringFunc = Function.prototype.toString;

/**
 * A cached reference to `Object.getPrototypeOf`.
 *
 * @private
 */
export const getProto = Object.getPrototypeOf;
