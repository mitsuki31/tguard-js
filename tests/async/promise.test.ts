import { isPromise, isPromiseLike } from '../../src/async/promise';

describe('async/promise', () => {
  //#region isPromiseLike

  describe('isPromiseLike', () => {
    test('should return true for Promise objects', () => {
      expect(isPromiseLike(new Promise(() => {}))).toBe(true);
      expect(isPromiseLike(Promise.resolve())).toBe(true);
      expect(isPromiseLike(Promise.reject().catch(() => {}))).toBe(true);
    });

    test('should return true for thenable objects', () => {
      expect(isPromiseLike({ then: () => {} })).toBe(true);
      expect(
        isPromiseLike({
          then: () => {},
          catch: () => {},
        })
      ).toBe(true);
    });

    test('should return true for async functions', () => {
      const asyncFunc = async () => {};
      expect(isPromiseLike(asyncFunc())).toBe(true);
    });

    test('should return false for objects without then', () => {
      expect(isPromiseLike({})).toBe(false);
      expect(isPromiseLike({ catch: () => {} })).toBe(false);
    });

    test('should return false for objects with non-function then', () => {
      expect(isPromiseLike({ then: 'not a function' })).toBe(false);
      expect(isPromiseLike({ then: 123 })).toBe(false);
      expect(isPromiseLike({ then: null })).toBe(false);
    });

    test('should return false for non-objects', () => {
      expect(isPromiseLike('promise')).toBe(false);
      expect(isPromiseLike(123)).toBe(false);
      expect(isPromiseLike(null)).toBe(false);
      expect(isPromiseLike(undefined)).toBe(false);
    });

    test('should return false for regular functions', () => {
      expect(isPromiseLike(() => {})).toBe(false);
      expect(isPromiseLike(function () {})).toBe(false);
    });
  });

  //#endregion
  //#region isPromise

  describe('isPromise', () => {
    test('should return true for Promise objects', () => {
      expect(isPromise(new Promise(() => {}))).toBe(true);
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(Promise.reject().catch(() => {}))).toBe(true);
    });

    test('should return true for async function results', () => {
      const asyncFunc = async () => {};
      expect(isPromise(asyncFunc())).toBe(true);
    });

    test('should return false for thenable objects', () => {
      expect(isPromise({ then: () => {} })).toBe(false);
      expect(
        isPromise({
          then: () => {},
          catch: () => {},
        })
      ).toBe(false);
    });

    test('should return false for non-promises', () => {
      expect(isPromise({})).toBe(false);
      expect(isPromise([])).toBe(false);
      expect(isPromise('promise')).toBe(false);
      expect(isPromise(123)).toBe(false);
      expect(isPromise(true)).toBe(false);
      expect(isPromise(null)).toBe(false);
      expect(isPromise(undefined)).toBe(false);
    });

    test('should return false for functions', () => {
      expect(isPromise(() => {})).toBe(false);
      expect(isPromise(function () {})).toBe(false);
      expect(isPromise(async () => {})).toBe(false);
    });
  });

  //#endregion
});
