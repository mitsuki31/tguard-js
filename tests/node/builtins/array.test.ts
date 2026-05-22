// ! Developer note:
// ! Keep imports and test cases sorted alphabetically to keep organized and easy to maintain.

import {
  is2DArray,
  isArray,
  isArrayOf,
  isBigIntArray,
  isBooleanArray,
  isDenseArray,
  isEmptyArray,
  isFunctionArray,
  isMatrix,
  isNumberArray,
  isObjectArray,
  isPlainObjectArray,
  isReadonlyArray,
  isStringArray,
  isSymbolArray,
  isTuple,
  isUniqueArray,
} from '../../../src/builtins/array';
import { isBoolean, isNumber, isString } from '../../../src/builtins/primitive';

describe('builtins/array', () => {
  //#region is2DArray

  describe('is2DArray', () => {
    test('should return true for two-dimensional arrays', () => {
      expect(is2DArray([[]])).toBe(true);
      expect(is2DArray([['a', 'b'], ['c']])).toBe(true);
      expect(is2DArray([new Array(4)])).toBe(true);
      expect(is2DArray([new Array()])).toBe(true);
    });

    test('should return false for non-two-dimensional arrays', () => {
      expect(is2DArray([])).toBe(false);
      expect(is2DArray(new Array(2))).toBe(false);
      expect(is2DArray([{ length: 2 }])).toBe(false);
      expect(is2DArray({ '0': { length: 0 }, length: 1 })).toBe(false);
    });
  });

  //#endregion

  //#region isArray

  describe('isArray', () => {
    test('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(['a', 'b'])).toBe(true);
      expect(isArray(new Array())).toBe(true);
      expect(isArray(new Array(3))).toBe(true);
    });

    test('should return false for array-like objects', () => {
      expect(isArray({ length: 0 })).toBe(false);
      expect(isArray('text')).toBe(false);
    });

    test('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray('text')).toBe(false);
      expect(isArray(123)).toBe(false);
      expect(isArray(true)).toBe(false);
      expect(isArray(() => {})).toBe(false);
      expect(isArray(new Date())).toBe(false);
      expect(isArray(new Map())).toBe(false);
    });
  });

  //#endregion
  //#region isArrayOf

  describe('isArrayOf', () => {
    test('should return true for arrays where all elements satisfy the predicate', () => {
      expect(isArrayOf([1, 2, 3], isNumber)).toBe(true);
      expect(isArrayOf(['a', 'b', 'c'], isString)).toBe(true);
      expect(isArrayOf([true, false], isBoolean)).toBe(true);
    });

    test('should return true for empty arrays', () => {
      expect(isArrayOf([], isNumber)).toBe(true);
      expect(isArrayOf([], isString)).toBe(true);
      //@ts-expect-error
      // Test if empty function can be used as predicate for empty array
      expect(isArrayOf([], (v) => true)).toBe(true);
    });

    test('should return false for arrays with non-matching elements', () => {
      expect(isArrayOf([1, 'a', 3], isNumber)).toBe(false);
      expect(isArrayOf(['a', 2, 'c'], isString)).toBe(false);
      expect(isArrayOf([true, 1, false], isBoolean)).toBe(false);
    });

    test('should return false for non-arrays', () => {
      expect(isArrayOf('text', isString)).toBe(false);
      expect(isArrayOf({}, isNumber)).toBe(false);
      expect(isArrayOf(null, isNumber)).toBe(false);
      expect(isArrayOf(undefined, isNumber)).toBe(false);
    });

    test('should return false for invalid predicates', () => {
      expect(isArrayOf([1, 2, 3], null as any)).toBe(false);
      expect(isArrayOf([1, 2, 3], 'not a function' as any)).toBe(false);
    });

    test('should support custom predicates', () => {
      const isEven = (n: any): n is number => isNumber(n) && n % 2 === 0;
      expect(isArrayOf([2, 4, 6], isEven)).toBe(true);
      expect(isArrayOf([2, 3, 6], isEven)).toBe(false);
    });

    test('should support union types', () => {
      const isStringOrNumber = (v: any): v is string | number =>
        isString(v) || isNumber(v);
      expect(isArrayOf([1, 'a', 2, 'b'], isStringOrNumber)).toBe(true);
      expect(isArrayOf([1, 'a', true, 'b'], isStringOrNumber)).toBe(false);
    });
  });

  //#endregion
  //#region isBigIntArray

  describe('isBigIntArray', () => {
    test('should return true for arrays of bigints', () => {
      expect(isBigIntArray([1n, 2n, 3n])).toBe(true);
      expect(isBigIntArray([0n, -1n])).toBe(true);
    });

    test('should return false for empty arrays', () => {
      expect(isBigIntArray([])).toBe(false);
    });

    test('should return false for arrays with non-bigint elements', () => {
      expect(isBigIntArray([1n, 2, 3n])).toBe(false);
      expect(isBigIntArray([1n, '2', 3n])).toBe(false);
      expect(isBigIntArray([1n, null, 3n])).toBe(false);
    });

    test('should return false for arrays containing regular numbers', () => {
      expect(isBigIntArray([1, 2, 3])).toBe(false);
    });

    test('should return false for non-arrays', () => {
      expect(isBigIntArray('123')).toBe(false);
      expect(isBigIntArray({})).toBe(false);
      expect(isBigIntArray(null)).toBe(false);
    });
  });

  //#endregion
  //#region isBooleanArray

  describe('isBooleanArray', () => {
    test('should return true for arrays of booleans', () => {
      expect(isBooleanArray([true, false])).toBe(true);
      expect(isBooleanArray([true, true, false])).toBe(true);
    });

    test('should return false for empty arrays', () => {
      expect(isBooleanArray([])).toBe(false);
    });

    test('should return false for arrays with non-boolean elements', () => {
      expect(isBooleanArray([true, 1, false])).toBe(false);
      expect(isBooleanArray([true, 'true', false])).toBe(false);
      expect(isBooleanArray([true, null, false])).toBe(false);
    });

    test('should return false for non-arrays', () => {
      expect(isBooleanArray('true')).toBe(false);
      expect(isBooleanArray({})).toBe(false);
      expect(isBooleanArray(null)).toBe(false);
    });
  });

  //#endregion
  //#region isDenseArray

  describe('isDenseArray', () => {
    test('should return true for dense arrays', () => {
      expect(isDenseArray([])).toBe(true);
      expect(isDenseArray([1, 2, 3])).toBe(true);
      expect(isDenseArray(new Array(10).fill('foo'))).toBe(true);
    });

    test('should return true for element `undefined` that is explicitly set', () => {
      expect(isDenseArray([undefined])).toBe(true);
      expect(isDenseArray([undefined, undefined])).toBe(true);
    });

    test('should return false for array that has holes (sparse arrays)', () => {
      const arrayWithDeletedElement = [1, 5, 7];
      delete arrayWithDeletedElement[1];

      expect(isDenseArray(['foo', , 'bar'])).toBe(false);
      expect(isDenseArray(new Array(5))).toBe(false);
      expect(isDenseArray(arrayWithDeletedElement)).toBe(false);
    });

    test('should return false for arrays that has extra enumerable property(ies)', () => {
      const arr = new Array(10).fill(100);
      (arr as any).extra = 'foo';

      expect(isDenseArray(arr)).toBe(false);
    });
  });

  //#endregion
  //#region isEmptyArray

  describe('isEmptyArray', () => {
    test('should return true for empty arrays', () => {
      expect(isEmptyArray([])).toBe(true);
      expect(isEmptyArray(new Array())).toBe(true);
    });

    test('should return false for non-empty arrays', () => {
      expect(isEmptyArray([1])).toBe(false);
      expect(isEmptyArray([1, 2, 3])).toBe(false);
      expect(isEmptyArray([''])).toBe(false);
      expect(isEmptyArray([null])).toBe(false);
      expect(isEmptyArray([undefined])).toBe(false);
      expect(isEmptyArray(new Array(10))).toBe(false);
    });

    test('should return false for arrays with holes', () => {
      // Note: [,] creates an array with one hole, length is 1
      expect(isEmptyArray([,])).toBe(false);
    });

    test('should return false for non-arrays', () => {
      expect(isEmptyArray({})).toBe(false);
      expect(isEmptyArray('')).toBe(false);
      expect(isEmptyArray(null)).toBe(false);
      expect(isEmptyArray(undefined)).toBe(false);
    });
  });

  //#endregion
  //#region isFunctionArray

  describe('isFunctionArray', () => {
    test('should return true for arrays of functions', () => {
      expect(
        isFunctionArray([() => {}, function () {}, (a: number) => a])
      ).toBe(true);
    });

    test('should return false for empty arrays', () => {
      expect(isFunctionArray([])).toBe(false);
    });

    test('should return false for arrays with non-function elements', () => {
      expect(isFunctionArray([() => {}, 'not a function'])).toBe(false);
      expect(isFunctionArray([() => {}, 123])).toBe(false);
      expect(isFunctionArray([() => {}, null])).toBe(false);
    });

    test('should return false for non-arrays', () => {
      expect(isFunctionArray('function')).toBe(false);
      expect(isFunctionArray({})).toBe(false);
      expect(isFunctionArray(null)).toBe(false);
    });
  });

  //#endregion
  //#region isMatrix

  describe('isMatrix', () => {
    test('should return true for matrices (numeric two-dimensional arrays)', () => {
      expect(
        isMatrix([
          [1, 2],
          [3, 4],
        ])
      ).toBe(true);
      expect(
        isMatrix([
          [1, 2, 3],
          [1, 2, 3],
        ])
      ).toBe(true);
      // prettier-ignore
      expect(isMatrix(
        [new Array(10).fill(1), new Array(10).fill(2)]
      )).toBe(true);
    });

    test('should return false for non-two-dimensional arrays', () => {
      expect(isMatrix([])).toBe(false);
      expect(isMatrix(new Array())).toBe(false);
      expect(isMatrix([1, 2])).toBe(false);
      expect(isMatrix({})).toBe(false);
      // Array-like objects
      expect(isMatrix({ length: 0 })).toBe(false);
      expect(isMatrix({ '0': { '0': 1, length: 1 }, length: 1 })).toBe(false);
    });

    test('should return false for non-numeric matrices', () => {
      expect(
        isMatrix([
          ['a', 'b'],
          ['c', 'd'],
        ])
      ).toBe(false);
      expect(
        isMatrix([
          ['a', 'b'],
          [1, 2],
        ])
      ).toBe(false);
      expect(isMatrix([[() => 0], [1]])).toBe(false);
      expect(isMatrix([[class {}], [{}]])).toBe(false);
    });

    test('should return false if have column that has different length with others', () => {
      expect(
        isMatrix([
          [1, 2, 3],
          [1, 2],
          [1, 2, 3],
        ])
      ).toBe(false);
    });

    test('should return false if the matrices has sparse columns', () => {
      expect(
        isMatrix([
          [1, 2, ,],
          [3, 4, 5],
        ])
      );
    });
  });

  //#endregion
  //#region isNumberArray

  describe('isNumberArray', () => {
    test('should return true for arrays of numbers', () => {
      expect(isNumberArray([1, 2, 3])).toBe(true);
      expect(isNumberArray([0, -1, 1.5])).toBe(true);
      expect(isNumberArray([NaN, Infinity, -Infinity])).toBe(true);
    });

    test('should return false for empty arrays', () => {
      expect(isNumberArray([])).toBe(false);
    });

    test('should return false for arrays with non-number elements', () => {
      expect(isNumberArray([1, '2', 3])).toBe(false);
      expect(isNumberArray(['a', 'b', 'c'])).toBe(false);
      expect(isNumberArray([1, null, 3])).toBe(false);
    });

    test('should return false for arrays containing bigints', () => {
      expect(isNumberArray([1, 2n, 3])).toBe(false);
    });

    test('should return false for non-arrays', () => {
      expect(isNumberArray('123')).toBe(false);
      expect(isNumberArray({})).toBe(false);
      expect(isNumberArray(null)).toBe(false);
    });
  });

  //#endregion
  //#region isObjectArray

  describe('isObjectArray', () => {
    test('should return true for arrays of objects', () => {
      expect(isObjectArray([{}, { a: 1 }, []])).toBe(true);
      expect(isObjectArray([new Date(), new Map()])).toBe(true);
    });

    test('should return false for empty arrays', () => {
      expect(isObjectArray([])).toBe(false);
    });

    test('should return false for arrays with non-object elements', () => {
      expect(isObjectArray([{}, 'not an object'])).toBe(false);
      expect(isObjectArray([{}, 123])).toBe(false);
      expect(isObjectArray([{}, null])).toBe(false);
    });

    test('should return false for non-arrays', () => {
      expect(isObjectArray('object')).toBe(false);
      expect(isObjectArray({})).toBe(false);
      expect(isObjectArray(null)).toBe(false);
    });
  });

  //#endregion
  //#region isPlainObjectArray

  describe('isPlainObjectArray', () => {
    test('should return true for arrays of plain objects', () => {
      expect(isPlainObjectArray([{}, { a: 1 }, { b: 2 }])).toBe(true);
      expect(isPlainObjectArray([Object.create(null)])).toBe(true);
    });

    test('should return false for empty arrays', () => {
      expect(isPlainObjectArray([])).toBe(false);
    });

    test('should return false for arrays with non-plain objects', () => {
      expect(isPlainObjectArray([{}, []])).toBe(false);
      expect(isPlainObjectArray([{}, new Date()])).toBe(false);
      expect(isPlainObjectArray([{}, new Map()])).toBe(false);
    });

    test('should return false for arrays with class instances', () => {
      class TestClass {}
      expect(isPlainObjectArray([{}, new TestClass()])).toBe(false);
    });

    test('should return false for arrays with null or primitives', () => {
      expect(isPlainObjectArray([{}, null])).toBe(false);
      expect(isPlainObjectArray([{}, 123])).toBe(false);
    });

    test('should return false for non-arrays', () => {
      expect(isPlainObjectArray('object')).toBe(false);
      expect(isPlainObjectArray({})).toBe(false);
      expect(isPlainObjectArray(null)).toBe(false);
    });
  });

  //#endregion
  //#region isReadonlyArray

  describe('isReadonlyArray', () => {
    test('should return true for frozen arrays', () => {
      const arr = [1, 2, 3];
      Object.freeze(arr);
      expect(isReadonlyArray(arr)).toBe(true);
    });

    test('should return true for empty frozen arrays', () => {
      const arr: any[] = [];
      Object.freeze(arr);
      expect(isReadonlyArray(arr)).toBe(true);
    });

    test('should return false for regular arrays', () => {
      expect(isReadonlyArray([])).toBe(false);
      expect(isReadonlyArray([1, 2, 3])).toBe(false);
    });

    test('should return false for sealed arrays (not frozen)', () => {
      const arr: any[] = [1, 2, 3];
      Object.seal(arr);
      expect(isReadonlyArray(arr)).toBe(false);
    });

    test('should return false for arrays with preventExtensions', () => {
      const arr: any[] = [1, 2, 3];
      Object.preventExtensions(arr);
      expect(isReadonlyArray(arr)).toBe(false);
    });

    test('should return false for non-arrays', () => {
      expect(isReadonlyArray({})).toBe(false);
      expect(isReadonlyArray('text')).toBe(false);
      expect(isReadonlyArray(null)).toBe(false);
      expect(isReadonlyArray(undefined)).toBe(false);
    });
  });

  //#endregion
  //#region isStringArray

  describe('isStringArray', () => {
    test('should return true for arrays of strings', () => {
      expect(isStringArray(['a', 'b', 'c'])).toBe(true);
      expect(isStringArray(['hello', 'world'])).toBe(true);
      expect(isStringArray([''])).toBe(true);
    });

    test('should return false for empty arrays', () => {
      expect(isStringArray([])).toBe(false);
    });

    test('should return false for arrays with non-string elements', () => {
      expect(isStringArray(['a', 1, 'c'])).toBe(false);
      expect(isStringArray([1, 2, 3])).toBe(false);
      expect(isStringArray(['a', null, 'c'])).toBe(false);
    });

    test('should return false for non-arrays', () => {
      expect(isStringArray('text')).toBe(false);
      expect(isStringArray({})).toBe(false);
      expect(isStringArray(null)).toBe(false);
    });
  });

  //#endregion
  //#region isSymbolArray

  describe('isSymbolArray', () => {
    test('should return true for arrays of symbols', () => {
      expect(isSymbolArray([Symbol('a'), Symbol('b')])).toBe(true);
      expect(isSymbolArray([Symbol.iterator, Symbol.hasInstance])).toBe(true);
    });

    test('should return false for empty arrays', () => {
      expect(isSymbolArray([])).toBe(false);
    });

    test('should return false for arrays with non-symbol elements', () => {
      expect(isSymbolArray([Symbol('a'), 'b', Symbol('c')])).toBe(false);
      expect(isSymbolArray([Symbol('a'), 1, Symbol('c')])).toBe(false);
      expect(isSymbolArray([Symbol('a'), null, Symbol('c')])).toBe(false);
    });

    test('should return false for non-arrays', () => {
      expect(isSymbolArray('symbol')).toBe(false);
      expect(isSymbolArray({})).toBe(false);
      expect(isSymbolArray(null)).toBe(false);
    });
  });

  //#endregion
  //#region isTuple

  describe('isTuple', () => {
    test('should return false for non-arrays', () => {
      expect(isTuple('text', [isString, isNumber])).toBe(false);
      expect(isTuple({}, [isString, isNumber])).toBe(false);
      expect(isTuple(null, [isString, isNumber])).toBe(false);
      expect(isTuple(undefined, [isString, isNumber])).toBe(false);
    });

    test('should validate heterogeneous tuples by position and exact length', () => {
      expect(isTuple(['hello', 123], [isString, isNumber])).toBe(true);
      // prettier-ignore
      expect(isTuple(
        ['hello', 'not-number'],
        [isString, isNumber]
      )).toBe(false);
      expect(isTuple([123, 'hello'], [isString, isNumber])).toBe(false);

      // Extra element -> false
      expect(isTuple(['hello', 123, true], [isString, isNumber])).toBe(false);
      // Missing element -> false
      expect(isTuple(['hello'], [isString, isNumber])).toBe(false);
    });

    test('should return true for empty tuple with empty predicate list', () => {
      expect(isTuple([], [])).toBe(true);
    });

    test('should validate homogeneous tuples/arrays with single predicate', () => {
      expect(isTuple([1, 2, 3], isNumber)).toBe(true);
      expect(isTuple([1, '2', 3], isNumber)).toBe(false);
    });

    test('should return false for homogeneous tuple/array when empty', () => {
      expect(isTuple([], isNumber)).toBe(false);
    });
  });

  //#endregion
  //#region isUniqueArray

  describe('isUniqueArray', () => {
    test('should return false for non-arrays', () => {
      expect(isUniqueArray('text')).toBe(false);
      expect(isUniqueArray({})).toBe(false);
      expect(isUniqueArray(null)).toBe(false);
      expect(isUniqueArray(undefined)).toBe(false);
    });

    test('should return true for empty arrays', () => {
      expect(isUniqueArray([])).toBe(true);
      expect(isUniqueArray(new Array())).toBe(true);
    });

    test('should return true for unique primitive values', () => {
      expect(isUniqueArray([1, 2, 3])).toBe(true);
      expect(isUniqueArray(['a', 'b', 'c'])).toBe(true);
      expect(isUniqueArray([true, false])).toBe(true);
    });

    test('should return false for duplicate primitive values', () => {
      expect(isUniqueArray([1, 2, 1])).toBe(false);
      expect(isUniqueArray(['a', 'b', 'a'])).toBe(false);
      expect(isUniqueArray([false, false])).toBe(false);
    });

    test('should treat NaN as equal to NaN (SameValueZero)', () => {
      expect(isUniqueArray([NaN, NaN])).toBe(false);
      expect(isUniqueArray([NaN, 1])).toBe(true);
    });

    test('should compare objects by reference identity', () => {
      const a = {};
      const b = {};

      class Bar {}
      const bar = new Bar();

      expect(isUniqueArray([a, b])).toBe(true);
      expect(isUniqueArray([bar, new Bar()])).toBe(true);
      expect(isUniqueArray([a, a])).toBe(false);
      expect(isUniqueArray([bar, bar])).toBe(false);
    });

    test('should consider mixed values unique when they are SameValueZero-distinct', () => {
      expect(isUniqueArray([1, '1', 1n])).toBe(true);
      expect(isUniqueArray([0, -0])).toBe(false);
    });
  });

  //#endregion
});
