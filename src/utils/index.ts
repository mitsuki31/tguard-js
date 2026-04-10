/**
 * @module    typeguard.utils
 * @author    Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license   MIT
 * @since     1.0.0
 */

/**
 * Determines whether the provided value has an own property.
 *
 * @typeParam K - The type of the property key.
 * @param obj - The object to be used to check for an own property.
 * @param key - The property key to be checked.
 *
 * @returns `true` if the value has an own property, otherwise `false`.
 *
 * @example
 * ```typescript
 * const obj = { a: 1 };
 * hasOwn(obj, 'a');  // true
 * hasOwn(obj, 'b');  // false
 * ```
 *
 * @since 1.0.0
 */
export function hasOwn<K extends PropertyKey>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    Object.prototype.hasOwnProperty.call(obj, key)
  );
}

/**
 * Returns the type of the provided value as a string.
 *
 * For `null`, this returns `'null'`.
 * For objects and class instances, this returns a detailed tag such as `'[object Date]'`.
 * When `nameOnly` is `true`, object-like values return only the tag name, such as `'Date'`.
 *
 * @param x - The value whose type is to be determined.
 * @param nameOnly - Whether to return only the tag name for object-like values.
 * @returns A string representing the type of the value.
 *
 * @since 1.0.0
 */
export function getType(x: unknown, nameOnly?: boolean): string {
  if (x === null) return nameOnly ? 'null' : '[object Null]';

  const type = typeof x;
  if (type !== 'object') return type;

  const tag = Object.prototype.toString.call(x);
  return nameOnly ? tag.slice(8, -1) : tag;
}

/**
 * Returns the detailed type of the provided value as a string.
 *
 * @remarks
 * This function is an alias for {@linkcode getType} with `nameOnly` set to `false`.
 *
 * @param x - The value whose type is to be determined.
 * @returns A string representing the detailed type of the value.
 *
 * @since 1.0.0
 * @see {@link getType}
 */
export function typeOf(x: unknown): string {
  return getType(x, false);
}
