import {
  isFinite,
  isPrimitive,
  isString,
  isNumber,
  isNaN,
  isInfinite,
  isBigInt,
  isBoolean,
  isBool,
  isSymbol,
  isNull,
  isUndefined,
  isNullOrUndefined,
  isNullish,
  isNonNullish,
  isDefined,
} from '../../src/builtins/primitive';

describe('builtins/primitive', () => {
  //#region isPrimitive

  describe('isPrimitive', () => {
    test('should return true for null', () => {
      expect(isPrimitive(null)).toBe(true);
    });

    test('should return true for undefined', () => {
      expect(isPrimitive(undefined)).toBe(true);
    });

    test('should return true for strings', () => {
      expect(isPrimitive('hello')).toBe(true);
      expect(isPrimitive('')).toBe(true);
      expect(isPrimitive('0')).toBe(true);
    });

    test('should return true for numbers', () => {
      expect(isPrimitive(0)).toBe(true);
      expect(isPrimitive(1)).toBe(true);
      expect(isPrimitive(123)).toBe(true);
      expect(isPrimitive(1.5)).toBe(true);
      expect(isPrimitive(-123)).toBe(true);
      expect(isPrimitive(NaN)).toBe(true);
      expect(isPrimitive(Infinity)).toBe(true);
      expect(isPrimitive(-Infinity)).toBe(true);
    });

    test('should return true for bigints', () => {
      expect(isPrimitive(1n)).toBe(true);
      expect(isPrimitive(0n)).toBe(true);
      expect(isPrimitive(BigInt(123))).toBe(true);
    });

    test('should return true for booleans', () => {
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(false)).toBe(true);
    });

    test('should return true for symbols', () => {
      expect(isPrimitive(Symbol('test'))).toBe(true);
      expect(isPrimitive(Symbol.iterator)).toBe(true);
    });

    test('should return false for arrays', () => {
      expect(isPrimitive([])).toBe(false);
      expect(isPrimitive([1, 2, 3])).toBe(false);
    });

    test('should return false for objects', () => {
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive({ a: 1 })).toBe(false);
      expect(isPrimitive(Object.create(null))).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isPrimitive(() => {})).toBe(false);
      expect(isPrimitive(function () {})).toBe(false);
      expect(isPrimitive(class A {})).toBe(false);
    });

    test('should return false for Date objects', () => {
      expect(isPrimitive(new Date())).toBe(false);
    });

    test('should return false for Maps and Sets', () => {
      expect(isPrimitive(new Map())).toBe(false);
      expect(isPrimitive(new Set())).toBe(false);
    });

    test('should return false for RegExp', () => {
      expect(isPrimitive(/test/)).toBe(false);
      expect(isPrimitive(new RegExp('test'))).toBe(false);
    });

    test('should return false for Error', () => {
      expect(isPrimitive(new Error())).toBe(false);
      expect(isPrimitive(new TypeError())).toBe(false);
    });
  });

  //#endregion
  //#region isString

  describe('isString', () => {
    test('should return true for strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString('0')).toBe(true);
      expect(isString('false')).toBe(true);
    });

    test('should return false for non-strings', () => {
      expect(isString(0)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString(true)).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString(() => {})).toBe(false);
    });
  });

  //#endregion
  //#region isNumber

  describe('isNumber', () => {
    test('should return true for numbers', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(1)).toBe(true);
      expect(isNumber(123)).toBe(true);
      expect(isNumber(-123)).toBe(true);
      expect(isNumber(1.5)).toBe(true);
      expect(isNumber(0xfff)).toBe(true);
      expect(isNumber(0b100)).toBe(true);
      expect(isNumber(1e5)).toBe(true);
      expect(isNumber(NaN)).toBe(true);
      expect(isNumber(Infinity)).toBe(true);
      expect(isNumber(-Infinity)).toBe(true);
    });

    test('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber(1n)).toBe(false);
      expect(isNumber(true)).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(isNumber({})).toBe(false);
    });
  });

  //#endregion
  //#region isFinite

  describe('isFinite', () => {
    test('should return true for finite numbers', () => {
      expect(isFinite(0)).toBe(true);
      expect(isFinite(1)).toBe(true);
      expect(isFinite(123)).toBe(true);
      expect(isFinite(-123)).toBe(true);
      expect(isFinite(1.5)).toBe(true);
      expect(isFinite(0xfff)).toBe(true);
      expect(isFinite(0b100)).toBe(true);
      expect(isFinite(1e5)).toBe(true);
    });

    test('should return false for infinite numbers', () => {
      expect(isFinite(Infinity)).toBe(false);
      expect(isFinite(-Infinity)).toBe(false);
    });

    test('should return false for NaN', () => {
      expect(isFinite(NaN)).toBe(false);
    });

    test('should return false for non-numbers', () => {
      expect(isFinite('123')).toBe(false);
      expect(isFinite(null)).toBe(false);
      expect(isFinite(undefined)).toBe(false);
      expect(isFinite(1n)).toBe(false);
      expect(isFinite(true)).toBe(false);
    });
  });

  //#endregion
  //#region isInfinite

  describe('isInfinite', () => {
    test('should return true for positive infinity', () => {
      expect(isInfinite(Infinity)).toBe(true);
      expect(isInfinite(1 / 0)).toBe(true);
    });

    test('should return true for negative infinity', () => {
      expect(isInfinite(-Infinity)).toBe(true);
      expect(isInfinite(-1 / 0)).toBe(true);
    });

    test('should return false for finite numbers', () => {
      expect(isInfinite(0)).toBe(false);
      expect(isInfinite(1)).toBe(false);
      expect(isInfinite(123)).toBe(false);
      expect(isInfinite(-123)).toBe(false);
      expect(isInfinite(1.5)).toBe(false);
    });

    test('should return false for NaN', () => {
      expect(isInfinite(NaN)).toBe(false);
    });

    test('should return false for non-numbers', () => {
      expect(isInfinite('Infinity')).toBe(false);
      expect(isInfinite(null)).toBe(false);
      expect(isInfinite(undefined)).toBe(false);
      expect(isInfinite(true)).toBe(false);
    });
  });

  //#endregion
  //#region isBigInt

  describe('isBigInt', () => {
    test('should return true for bigints', () => {
      expect(isBigInt(1n)).toBe(true);
      expect(isBigInt(0n)).toBe(true);
      expect(isBigInt(123n)).toBe(true);
      expect(isBigInt(-123n)).toBe(true);
      expect(isBigInt(BigInt(123))).toBe(true);
    });

    test('should return false for non-bigints', () => {
      expect(isBigInt(1)).toBe(false);
      expect(isBigInt('123')).toBe(false);
      expect(isBigInt(null)).toBe(false);
      expect(isBigInt(undefined)).toBe(false);
      expect(isBigInt(true)).toBe(false);
      expect(isBigInt([])).toBe(false);
    });
  });

  //#endregion
  //#region isNaN

  describe('isNaN', () => {
    test('should return true for NaN', () => {
      expect(isNaN(NaN)).toBe(true);
      expect(isNaN(0 / 0)).toBe(true);
    });

    test('should return false for numbers', () => {
      expect(isNaN(0)).toBe(false);
      expect(isNaN(1)).toBe(false);
      expect(isNaN(123)).toBe(false);
      expect(isNaN(Infinity)).toBe(false);
      expect(isNaN(-Infinity)).toBe(false);
    });

    test('should return false for non-numbers', () => {
      expect(isNaN('NaN')).toBe(false);
      expect(isNaN('123')).toBe(false);
      expect(isNaN(null)).toBe(false);
      expect(isNaN(undefined)).toBe(false);
      expect(isNaN(true)).toBe(false);
    });
  });

  //#endregion
  //#region isBoolean

  describe('isBoolean', () => {
    test('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    test('should return false for non-booleans', () => {
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean('false')).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
      expect(isBoolean([])).toBe(false);
    });
  });

  //#endregion
  //#region isBool

  describe('isBool', () => {
    test('should return true for booleans (alias for isBoolean)', () => {
      expect(isBool(true)).toBe(true);
      expect(isBool(false)).toBe(true);
    });

    test('should return false for non-booleans', () => {
      expect(isBool(1)).toBe(false);
      expect(isBool(0)).toBe(false);
      expect(isBool('true')).toBe(false);
      expect(isBool(null)).toBe(false);
    });
  });

  //#endregion
  //#region isSymbol

  describe('isSymbol', () => {
    test('should return true for symbols', () => {
      expect(isSymbol(Symbol('test'))).toBe(true);
      expect(isSymbol(Symbol())).toBe(true);
      expect(isSymbol(Symbol.iterator)).toBe(true);
      expect(isSymbol(Symbol.hasInstance)).toBe(true);
    });

    test('should return false for non-symbols', () => {
      expect(isSymbol('test')).toBe(false);
      expect(isSymbol(123)).toBe(false);
      expect(isSymbol(null)).toBe(false);
      expect(isSymbol(undefined)).toBe(false);
      expect(isSymbol(true)).toBe(false);
      expect(isSymbol([])).toBe(false);
    });
  });

  //#endregion
  //#region isNull

  describe('isNull', () => {
    test('should return true for null', () => {
      expect(isNull(null)).toBe(true);
    });

    test('should return false for non-null values', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull('')).toBe(false);
      expect(isNull(false)).toBe(false);
      expect(isNull([])).toBe(false);
      expect(isNull({})).toBe(false);
    });
  });

  //#endregion
  //#region isUndefined

  describe('isUndefined', () => {
    test('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    test('should return false for non-undefined values', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined('')).toBe(false);
      expect(isUndefined(false)).toBe(false);
      expect(isUndefined([])).toBe(false);
      expect(isUndefined({})).toBe(false);
    });
  });

  //#endregion
  //#region isNullOrUndefined

  describe('isNullOrUndefined', () => {
    test('should return true for null', () => {
      expect(isNullOrUndefined(null)).toBe(true);
    });

    test('should return true for undefined', () => {
      expect(isNullOrUndefined(undefined)).toBe(true);
    });

    test('should return false for other values', () => {
      expect(isNullOrUndefined(0)).toBe(false);
      expect(isNullOrUndefined('')).toBe(false);
      expect(isNullOrUndefined(false)).toBe(false);
      expect(isNullOrUndefined([])).toBe(false);
      expect(isNullOrUndefined({})).toBe(false);
      expect(isNullOrUndefined('null')).toBe(false);
    });
  });

  //#endregion
  //#region isNullish

  describe('isNullish', () => {
    test('should return true for null', () => {
      expect(isNullish(null)).toBe(true);
    });

    test('should return true for undefined', () => {
      expect(isNullish(undefined)).toBe(true);
    });

    test('should return false for other values', () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish('')).toBe(false);
      expect(isNullish(false)).toBe(false);
      expect(isNullish([])).toBe(false);
      expect(isNullish({})).toBe(false);
    });
  });

  //#endregion
  //#region isNonNullish

  describe('isNonNullish', () => {
    test('should return true for non-nullish values', () => {
      expect(isNonNullish(0)).toBe(true);
      expect(isNonNullish('')).toBe(true);
      expect(isNonNullish(false)).toBe(true);
      expect(isNonNullish([])).toBe(true);
      expect(isNonNullish({})).toBe(true);
      expect(isNonNullish('null')).toBe(true);
    });

    test('should return false for null', () => {
      expect(isNonNullish(null)).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(isNonNullish(undefined)).toBe(false);
    });
  });

  //#endregion
  //#region isDefined

  describe('isDefined', () => {
    test('should return true for non-nullish values', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined([])).toBe(true);
      expect(isDefined({})).toBe(true);
      expect(isDefined('hello')).toBe(true);
    });

    test('should return false for null', () => {
      expect(isDefined(null)).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(isDefined(undefined)).toBe(false);
    });
  });

  //#endregion
});
