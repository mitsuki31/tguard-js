import { getType, hasOwn, typeOf } from '../../src/utils';

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
        nameOnly: 'value',  // Return the field name above
      },
    },
    {
      value: () => ({}),
      expected: {
        default: 'function',
        nameOnly: 'value',  // Return the field name above
      },
    },
    {
      value: () => {},
      expected: {
        default: 'function',
        nameOnly: 'value',  // Return the field name above
      },
    },
    {
      value: class {},
      expected: {
        default: 'function',  // ES6 class always returned as function
        nameOnly: 'value'     // Return the field name above
      }
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
    })

    test('should handle class instances correctly', () => {
      class MyClass {}
      const instance = new MyClass();
      expect(getType(instance)).toContain('Object');
      expect(getType(instance, true)).toContain('Object');
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
