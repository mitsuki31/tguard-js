// ! Developer note:
// ! Keep imports and test cases sorted alphabetically to keep organized and easy to maintain.

import { getType, hasKeys, hasOwn, hasShape, typeOf } from '../../src/utils';
import { isString, isNumber, isUndefined } from '../../src/builtins/primitive';

describe('typeguard/utils', () => {
  const types = [
    {
      value: null,
      expected: {
        default: '[object Null]',
        nameOnly: 'null',
      },
    },
    {
      value: undefined,
      expected: {
        default: 'undefined',
        nameOnly: 'undefined',
      },
    },
    {
      value: 'hello',
      expected: {
        default: 'string',
        nameOnly: 'string',
      },
    },
    {
      value: 123,
      expected: {
        default: 'number',
        nameOnly: 'number',
      },
    },
    {
      value: 123n,
      expected: {
        default: 'bigint',
        nameOnly: 'bigint',
      },
    },
    {
      value: true,
      expected: {
        default: 'boolean',
        nameOnly: 'boolean',
      },
    },
    {
      value: Symbol('test'),
      expected: {
        default: 'symbol',
        nameOnly: 'symbol',
      },
    },
    {
      value: function () {},
      expected: {
        default: 'function',
        nameOnly: 'value', // Return the field name above
      },
    },
    {
      value: () => ({}),
      expected: {
        default: 'function',
        nameOnly: 'value', // Return the field name above
      },
    },
    {
      value: () => {},
      expected: {
        default: 'function',
        nameOnly: 'value', // Return the field name above
      },
    },
    {
      value: class {},
      expected: {
        default: 'function', // ES6 class always returned as function
        nameOnly: 'value', // Return the field name above
      },
    },
    {
      value: {},
      expected: {
        default: '[object Object]',
        nameOnly: 'Object',
      },
    },
    {
      value: [],
      expected: {
        default: '[object Array]',
        nameOnly: 'Array',
      },
    },
    {
      value: new Date(),
      expected: {
        default: '[object Date]',
        nameOnly: 'Date',
      },
    },
    {
      value: new Map(),
      expected: {
        default: '[object Map]',
        nameOnly: 'Map',
      },
    },
    {
      value: new Set(),
      expected: {
        default: '[object Set]',
        nameOnly: 'Set',
      },
    },
    {
      value: new RegExp(''),
      expected: {
        default: '[object RegExp]',
        nameOnly: 'RegExp',
      },
    },
    {
      value: new Error(),
      expected: {
        default: '[object Error]',
        nameOnly: 'Error',
      },
    },
    {
      value: new Promise(() => {}),
      expected: {
        default: '[object Promise]',
        nameOnly: 'Promise',
      },
    },
    {
      value: new Proxy({}, {}),
      expected: {
        default: '[object Object]',
        nameOnly: 'Object',
      },
    },
  ];

  //#region getType

  describe('getType', () => {
    test('should return the type of the provided value as a string', () => {
      types.forEach((type) => {
        expect(getType(type.value)).toBe(type.expected.default);
      });
    });

    test('should return the type of the provided value as a string when nameOnly is true', () => {
      types.forEach((type) => {
        expect(getType(type.value, true)).toBe(type.expected.nameOnly);
      });
    });

    test("should return '(anonymous)' for classes/functions without bindings when nameOnly is true", () => {
      [() => {}, function () {}, class {}].forEach((type) => {
        expect(getType(type, true)).toBe('(anonymous)');
      });
    });

    test('should handle class instances correctly', () => {
      class MyClass {}
      const instance = new MyClass();
      expect(getType(instance)).toContain('Object');
      expect(getType(instance, true)).toContain('Object');
    });
  });

  //#endregion
  //#region hasKeys

  describe('hasKeys', () => {
    test('should return true for object with all required keys', () => {
      const obj = {
        name: 'alice',
        age: 20,
      };

      expect(hasKeys(obj, ['name', 'age'])).toBe(true);
    });

    test('should return false if one key is missing', () => {
      const obj = {
        name: 'alice',
      };

      expect(hasKeys(obj, ['name', 'age'])).toBe(false);
    });

    test('should return true for empty keys array', () => {
      expect(hasKeys({ a: 1 }, [])).toBe(true);
    });

    test('should return false for null', () => {
      expect(hasKeys(null, ['a'])).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(hasKeys(undefined, ['a'])).toBe(false);
    });

    test('should return false for primitive values', () => {
      expect(hasKeys(123, ['a'])).toBe(false);
      expect(hasKeys(123n, ['a'])).toBe(false);
      expect(hasKeys(NaN, ['a'])).toBe(false);
      expect(hasKeys('hello', ['a'])).toBe(false);
      expect(hasKeys(true, ['a'])).toBe(false);
      expect(hasKeys(Symbol('id'), ['a'])).toBe(false);
      expect(hasKeys(null, ['a'])).toBe(false);
      expect(hasKeys(undefined, ['a'])).toBe(false);
    });

    test('should ignore inherited properties', () => {
      class User {
        name = 'alice';
      }

      (User.prototype as any).role = 'admin';
      const obj = new User();

      expect(hasKeys(obj, ['role'])).toBe(false);
    });

    test('should support symbol keys with includeHidden enabled', () => {
      const id = Symbol('id');
      const obj = {
        [id]: 123,
      };

      expect(hasKeys(obj, [id], true)).toBe(true);
    });

    test('should reject symbol keys when includeHidden is disabled', () => {
      const id = Symbol('id');
      const obj = {
        [id]: 123,
      };

      expect(hasKeys(obj, [id])).toBe(false);
    });

    test('should support non-enumerable properties with includeHidden enabled', () => {
      const obj = {};
      Object.defineProperty(obj, 'hidden', {
        value: true,
        enumerable: false,
      });

      expect(hasKeys(obj, ['hidden'], true)).toBe(true);
    });

    test('should reject non-enumerable properties by default', () => {
      const obj = {};
      Object.defineProperty(obj, 'hidden', {
        value: true,
        enumerable: false,
      });

      expect(hasKeys(obj, ['hidden'])).toBe(false);
    });

    test('should support arrays', () => {
      expect(hasKeys(['a', 'b'], ['0', '1'])).toBe(true);
    });

    test('should expose array length only with includeHidden enabled', () => {
      expect(hasKeys([], ['length'], true)).toBe(true);
      expect(hasKeys([], ['length'])).toBe(false);
    });
  });

  //#endregion
  //#region hasOwn

  describe('hasOwn', () => {
    test('should return true when object has own property', () => {
      const obj = { a: 1, b: 2 };
      expect(hasOwn(obj, 'a')).toBe(true);
      expect(hasOwn(obj, 'b')).toBe(true);
    });

    test('should return false when object does not have own property', () => {
      const obj = { a: 1 };
      expect(hasOwn(obj, 'b')).toBe(false);
      expect(hasOwn(obj, 'c')).toBe(false);
    });

    test('should return false for inherited properties', () => {
      const parent = { a: 1 };
      const child = Object.create(parent);
      expect(hasOwn(child, 'a')).toBe(false);
    });

    test('should return true for properties on Object.create(null)', () => {
      const obj = Object.create(null);
      (obj as any).a = 1;
      expect(hasOwn(obj, 'a')).toBe(true);
    });

    test('should return false for null', () => {
      expect(hasOwn(null, 'a')).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(hasOwn(undefined, 'a')).toBe(false);
    });

    test('should return false for primitives', () => {
      expect(hasOwn('string', 'a')).toBe(false);
      expect(hasOwn(123, 'a')).toBe(false);
      expect(hasOwn(true, 'a')).toBe(false);
    });

    test('should work with symbol keys', () => {
      const sym = Symbol('test');
      const obj = { [sym]: 'value' } as any;
      expect(hasOwn(obj, sym)).toBe(true);
    });

    test('should work with numeric string keys', () => {
      const obj = { '0': 'value' };
      expect(hasOwn(obj, '0')).toBe(true);
    });

    test('should return true for non-enumerable properties', () => {
      const obj = {};
      Object.defineProperty(obj, 'hidden', {
        value: 1,
        enumerable: false,
      });
      expect(hasOwn(obj, 'hidden')).toBe(true);
    });

    test('should work with arrays', () => {
      const arr = [1, 2, 3];
      expect(hasOwn(arr, '0')).toBe(true);
      expect(hasOwn(arr, '1')).toBe(true);
      expect(hasOwn(arr, '3')).toBe(false);
      expect(hasOwn(arr, 'length')).toBe(true);
    });
  });

  //#endregion
  //#region hasShape

  describe('hasShape', () => {
    test('should return true for matching object shape', () => {
      const obj = {
        name: 'alice',
        age: 20,
      };

      expect(
        hasShape(obj, {
          name: isString,
          age: isNumber,
        })
      ).toBe(true);
    });

    test('should return false if property is missing', () => {
      const obj = {
        name: 'alice',
      };

      expect(
        hasShape(obj, {
          name: isString,
          age: isNumber,
        })
      ).toBe(false);
    });

    test('should return false if property validator fails', () => {
      const obj = {
        name: 'alice',
        age: '20',
      };

      expect(
        hasShape(obj, {
          name: isString,
          age: isNumber,
        })
      ).toBe(false);
    });

    test('should allow additional properties', () => {
      const obj = {
        name: 'alice',
        age: 20,
        active: true,
      };

      expect(
        hasShape(obj, {
          name: isString,
        })
      ).toBe(true);
    });

    test('should return true for empty shape object', () => {
      expect(hasShape({ a: 1 }, {})).toBe(true);
    });

    test('should return false for nullish', () => {
      expect(
        hasShape(null, {
          a: isString,
        })
      ).toBe(false);
      expect(
        hasShape(undefined, {
          a: isString,
        })
      ).toBe(false);
    });

    test('should return false for primitive values', () => {
      expect(
        hasShape(123, {
          a: isString,
        })
      ).toBe(false);

      expect(
        hasShape('hello', {
          a: isString,
        })
      ).toBe(false);
    });

    test('should ignore inherited properties', () => {
      class User {
        name = 'alice';
      }

      (User.prototype as any).role = 'admin';
      const obj = new User();

      expect(
        hasShape(obj, {
          role: isString,
        })
      ).toBe(false);
    });

    test('should support symbol keys with includeHidden enabled', () => {
      const id = Symbol('id');
      const obj = {
        [id]: 123,
      };

      expect(hasShape(obj, { [id]: isNumber }, true)).toBe(true);
    });

    test('should reject symbol keys when includeHidden is disabled', () => {
      const id = Symbol('id');
      const obj = {
        [id]: 123,
      };

      expect(hasShape(obj, { [id]: isNumber })).toBe(false);
    });

    test('should support non-enumerable properties with includeHidden enabled', () => {
      const obj = {};
      Object.defineProperty(obj, 'hidden', {
        value: 123,
        enumerable: false,
      });

      expect(hasShape(obj, { hidden: isNumber }, true)).toBe(true);
    });

    test('should reject non-enumerable properties by default', () => {
      const obj = {};
      Object.defineProperty(obj, 'hidden', {
        value: 123,
        enumerable: false,
      });

      expect(hasShape(obj, { hidden: isNumber })).toBe(false);
    });

    test('should validate array indices', () => {
      expect(
        hasShape(['a', 'b'], {
          0: isString,
          1: isString,
        })
      ).toBe(true);
    });

    test('should validate array length with includeHidden enabled', () => {
      expect(hasShape([], { length: isNumber }, true)).toBe(true);
    });

    test('should reject sparse arrays when validating missing entries', () => {
      const arr = [,];

      expect(hasShape(arr, { 0: isUndefined })).toBe(false);
    });
  });

  //#endregion
  //#region typeOf

  describe('typeOf', () => {
    test('should return the type of the provided value as a string', () => {
      types.forEach((type) => {
        expect(typeOf(type.value)).toBe(type.expected.default);
      });
    });

    test('should be equivalent to getType with nameOnly false', () => {
      const values = [null, undefined, 'test', 123, true, [], {}, new Date()];
      values.forEach((val) => {
        expect(typeOf(val)).toBe(getType(val, false));
      });
    });
  });

  //#endregion
});
