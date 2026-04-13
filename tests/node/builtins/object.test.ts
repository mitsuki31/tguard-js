import {
  isObject,
  isPlainObject,
  isRecord,
  isEmptyObject,
  isSealed,
  isExtensible,
  isFrozen,
} from '../../../src/builtins/object';

describe('builtins/object', () => {
  //#region isObject

  describe('isObject', () => {
    test('should return true for plain objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    test('should return true for arrays', () => {
      expect(isObject([])).toBe(true);
      expect(isObject([1, 2, 3])).toBe(true);
    });

    test('should return true for Date objects', () => {
      expect(isObject(new Date())).toBe(true);
    });

    test('should return true for Map and Set', () => {
      expect(isObject(new Map())).toBe(true);
      expect(isObject(new Set())).toBe(true);
    });

    test('should return true for RegExp', () => {
      expect(isObject(/test/)).toBe(true);
      expect(isObject(new RegExp('test'))).toBe(true);
    });

    test('should return true for Error objects', () => {
      expect(isObject(new Error())).toBe(true);
      expect(isObject(new TypeError())).toBe(true);
    });

    test('should return true for class instances', () => {
      class A {}
      expect(isObject(new A())).toBe(true);
    });

    test('should return false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(isObject(undefined)).toBe(false);
    });

    test('should return false for primitives', () => {
      expect(isObject('text')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
      expect(isObject(Symbol('test'))).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isObject(() => {})).toBe(false);
      expect(isObject(function () {})).toBe(false);
    });
  });

  //#endregion
  //#region isPlainObject

  describe('isPlainObject', () => {
    test('should return true for object literals', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject({ a: 1, b: 2 })).toBe(true);
    });

    test('should return true for new Object()', () => {
      expect(isPlainObject(new Object())).toBe(true);
    });

    test('should return true for Object.create(null)', () => {
      expect(isPlainObject(Object.create(null))).toBe(true);
    });

    test('should return false for arrays', () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject([1, 2, 3])).toBe(false);
    });

    test('should return false for Date objects', () => {
      expect(isPlainObject(new Date())).toBe(false);
    });

    test('should return false for Map and Set', () => {
      expect(isPlainObject(new Map())).toBe(false);
      expect(isPlainObject(new Set())).toBe(false);
    });

    test('should return false for RegExp', () => {
      expect(isPlainObject(/test/)).toBe(false);
      expect(isPlainObject(new RegExp('test'))).toBe(false);
    });

    test('should return false for Error objects', () => {
      expect(isPlainObject(new Error())).toBe(false);
      expect(isPlainObject(new TypeError())).toBe(false);
    });

    test('should return false for class instances', () => {
      class A {}
      expect(isPlainObject(new A())).toBe(false);
    });

    test('should return false for null', () => {
      expect(isPlainObject(null)).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(isPlainObject(undefined)).toBe(false);
    });

    test('should return false for primitives', () => {
      expect(isPlainObject('text')).toBe(false);
      expect(isPlainObject(123)).toBe(false);
      expect(isPlainObject(true)).toBe(false);
      expect(isPlainObject(Symbol('test'))).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isPlainObject(() => {})).toBe(false);
      expect(isPlainObject(function () {})).toBe(false);
      expect(isPlainObject(class A {})).toBe(false);
    });
  });

  //#endregion
  //#region isRecord

  describe('isRecord', () => {
    test('should return true for plain objects (alias for isPlainObject)', () => {
      expect(isRecord({})).toBe(true);
      expect(isRecord({ a: 1 })).toBe(true);
      expect(isRecord(new Object())).toBe(true);
    });

    test('should return false for arrays', () => {
      expect(isRecord([])).toBe(false);
    });

    test('should return false for non-plain objects', () => {
      expect(isRecord(new Date())).toBe(false);
      expect(isRecord(new Map())).toBe(false);
      expect(isRecord(new Error())).toBe(false);
    });
  });

  //#endregion
  //#region isEmptyObject

  describe('isEmptyObject', () => {
    test('should return true for empty object literals', () => {
      expect(isEmptyObject({})).toBe(true);
    });

    test('should return true for new Object() with no properties', () => {
      expect(isEmptyObject(new Object())).toBe(true);
    });

    test('should return true for Object.create(null)', () => {
      expect(isEmptyObject(Object.create(null))).toBe(true);
    });

    test('should return true for objects with only symbol properties', () => {
      const obj = { [Symbol('a')]: 1 };
      expect(isEmptyObject(obj)).toBe(true);
    });

    test('should return false for objects with properties', () => {
      expect(isEmptyObject({ a: 1 })).toBe(false);
      expect(isEmptyObject({ a: 1, b: 2 })).toBe(false);
    });

    test('should return false for arrays', () => {
      expect(isEmptyObject([])).toBe(false);
      expect(isEmptyObject([1])).toBe(false);
    });

    test('should return false for non-plain objects', () => {
      expect(isEmptyObject(new Date())).toBe(false);
      expect(isEmptyObject(new Map())).toBe(false);
      expect(isEmptyObject(new Error())).toBe(false);
    });

    test('should return false for objects with non-enumerable properties', () => {
      const obj = {};
      Object.defineProperty(obj, 'hidden', { value: 1, enumerable: false });
      // Note: non-enumerable properties don't count for isEmptyObject
      expect(isEmptyObject(obj)).toBe(true);
    });

    test('should return false for primitives and nullish values', () => {
      expect(isEmptyObject(null)).toBe(false);
      expect(isEmptyObject(undefined)).toBe(false);
      expect(isEmptyObject('text')).toBe(false);
      expect(isEmptyObject(123)).toBe(false);
    });
  });

  //#endregion
  //#region isSealed

  describe('isSealed', () => {
    test('should return true for sealed objects', () => {
      const obj = {};
      Object.seal(obj);
      expect(isSealed(obj)).toBe(true);
    });

    test('should return true for sealed arrays', () => {
      const arr: any[] = [1, 2, 3];
      Object.seal(arr);
      expect(isSealed(arr)).toBe(true);
    });

    test('should return true for frozen objects (which are sealed)', () => {
      const obj = { foo: 1 };
      Object.freeze(obj);
      expect(isSealed(obj)).toBe(true);
    });

    test('should return true for frozen arrays', () => {
      const arr: any[] = [1, 2, 3];
      Object.freeze(arr);
      expect(isSealed(arr)).toBe(true);
    });

    test('should return false for regular objects', () => {
      expect(isSealed({})).toBe(false);
      expect(isSealed({ a: 1 })).toBe(false);
    });

    test('should return false for regular arrays', () => {
      expect(isSealed([])).toBe(false);
      expect(isSealed([1, 2, 3])).toBe(false);
    });

    test('should return false for non-sealed objects', () => {
      expect(isSealed(new Date())).toBe(false);
      expect(isSealed(new Map())).toBe(false);
    });

    test('should return false for primitives and nullish values', () => {
      // @ts-expect-error
      expect(isSealed(null)).toBe(false);
      // @ts-expect-error
      expect(isSealed(undefined)).toBe(false);
      // @ts-expect-error
      expect(isSealed('text')).toBe(false);
      // @ts-expect-error
      expect(isSealed(123)).toBe(false);
      // @ts-expect-error
      expect(isSealed(true)).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isSealed(() => {})).toBe(false);
    });
  });

  //#endregion
  //#region isExtensible

  describe('isExtensible', () => {
    test('should return true for regular objects', () => {
      expect(isExtensible({})).toBe(true);
      expect(isExtensible({ a: 1 })).toBe(true);
    });

    test('should return true for regular arrays', () => {
      expect(isExtensible([])).toBe(true);
      expect(isExtensible([1, 2, 3])).toBe(true);
    });

    test('should return false for sealed objects', () => {
      const obj = {};
      Object.seal(obj);
      expect(isExtensible(obj)).toBe(false);
    });

    test('should return false for sealed arrays', () => {
      const arr: any[] = [1, 2, 3];
      Object.seal(arr);
      expect(isExtensible(arr)).toBe(false);
    });

    test('should return false for frozen objects', () => {
      const obj = {};
      Object.freeze(obj);
      expect(isExtensible(obj)).toBe(false);
    });

    test('should return false for frozen arrays', () => {
      const arr: any[] = [1, 2, 3];
      Object.freeze(arr);
      expect(isExtensible(arr)).toBe(false);
    });

    test('should return false for pre-defined objects', () => {
      const obj = { bar: '__bar' };
      Object.preventExtensions(obj);
      expect(isExtensible(obj)).toBe(false);
    });

    test('should return false for primitives and nullish values', () => {
      expect(isExtensible(null)).toBe(false);
      expect(isExtensible(undefined)).toBe(false);
      expect(isExtensible('text')).toBe(false);
      expect(isExtensible(123)).toBe(false);
      expect(isExtensible(true)).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isExtensible(() => {})).toBe(false);
    });
  });

  //#endregion
  //#region isFrozen

  describe('isFrozen', () => {
    test('should return true for frozen objects', () => {
      const obj = {};
      Object.freeze(obj);
      expect(isFrozen(obj)).toBe(true);
    });

    test('should return true for frozen arrays', () => {
      const arr: any[] = [1, 2, 3];
      Object.freeze(arr);
      expect(isFrozen(arr)).toBe(true);
    });

    test('should return false for sealed objects (not frozen)', () => {
      const obj = { foo: '_foo' };
      Object.seal(obj);
      expect(isFrozen(obj)).toBe(false);
    });

    test('should return false for regular objects', () => {
      expect(isFrozen({})).toBe(false);
      expect(isFrozen({ a: 1 })).toBe(false);
    });

    test('should return false for regular arrays', () => {
      expect(isFrozen([])).toBe(false);
      expect(isFrozen([1, 2, 3])).toBe(false);
    });

    test('should return false for pre-defined objects', () => {
      const obj = { a: 'foo' };
      Object.preventExtensions(obj);
      expect(isFrozen(obj)).toBe(false);
    });

    test('should return false for non-frozen objects', () => {
      expect(isFrozen(new Date())).toBe(false);
      expect(isFrozen(new Map())).toBe(false);
    });

    test('should return false for primitives and nullish values', () => {
      expect(isFrozen(null)).toBe(false);
      expect(isFrozen(undefined)).toBe(false);
      expect(isFrozen('text')).toBe(false);
      expect(isFrozen(123)).toBe(false);
      expect(isFrozen(true)).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isFrozen(() => {})).toBe(false);
    });
  });

  //#endregion
});
