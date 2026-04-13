import {
  isFunction,
  isClass,
  isCallable,
} from '../../../src/builtins/function';

describe('builtins/function', () => {
  //#region isFunction

  describe('isFunction', () => {
    test('should return true for function declarations', () => {
      function myFunc() {}
      expect(isFunction(myFunc)).toBe(true);
    });

    test('should return true for arrow functions', () => {
      const arrowFunc = () => {};
      expect(isFunction(arrowFunc)).toBe(true);
    });

    test('should return true for function expressions', () => {
      const funcExpr = function () {};
      expect(isFunction(funcExpr)).toBe(true);
    });

    test('should return true for classes', () => {
      class MyClass {}
      expect(isFunction(MyClass)).toBe(true);
    });

    test('should return true for native functions', () => {
      expect(isFunction(Array.isArray)).toBe(true);
      expect(isFunction(Object.keys)).toBe(true);
      expect(isFunction(String.prototype.toUpperCase)).toBe(true);
    });

    test('should return true for bound functions', () => {
      function myFunc() {}
      expect(isFunction(myFunc.bind({}))).toBe(true);
    });

    test('should return false for non-functions', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction('function')).toBe(false);
      expect(isFunction(123)).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction(true)).toBe(false);
    });
  });

  //#endregion
  //#region isClass

  describe('isClass', () => {
    test('should return true for ES6 class declarations', () => {
      class MyClass {}
      expect(isClass(MyClass)).toBe(true);
    });

    test('should return true for class with extends', () => {
      class Parent {}
      class Child extends Parent {}
      expect(isClass(Child)).toBe(true);
    });

    test('should return false for regular function declarations', () => {
      function myFunc() {}
      expect(isClass(myFunc)).toBe(false);
    });

    test('should return false for arrow functions', () => {
      const arrowFunc = () => {};
      expect(isClass(arrowFunc)).toBe(false);
    });

    test('should return false for function expressions', () => {
      const funcExpr = function () {};
      expect(isClass(funcExpr)).toBe(false);
    });

    test('should return false for bound functions', () => {
      function myFunc() {}
      expect(isClass(myFunc.bind({}))).toBe(false);
    });

    test('should return false for non-functions', () => {
      expect(isClass({})).toBe(false);
      expect(isClass([])).toBe(false);
      expect(isClass('class')).toBe(false);
      expect(isClass(123)).toBe(false);
      expect(isClass(null)).toBe(false);
      expect(isClass(undefined)).toBe(false);
    });
  });

  //#endregion
  //#region isCallable

  describe('isCallable', () => {
    test('should return true for regular function declarations', () => {
      function myFunc() {}
      expect(isCallable(myFunc)).toBe(true);
    });

    test('should return true for arrow functions', () => {
      const arrowFunc = () => {};
      expect(isCallable(arrowFunc)).toBe(true);
    });

    test('should return true for function expressions', () => {
      const funcExpr = function () {};
      expect(isCallable(funcExpr)).toBe(true);
    });

    test('should return true for bound functions', () => {
      function myFunc() {}
      expect(isCallable(myFunc.bind({}))).toBe(true);
    });

    test('should return false for ES6 classes', () => {
      class MyClass {}
      expect(isCallable(MyClass)).toBe(false);
    });

    test('should return false for classes with extends', () => {
      class Parent {}
      class Child extends Parent {}
      expect(isCallable(Child)).toBe(false);
    });

    test('should return false for non-functions', () => {
      expect(isCallable({})).toBe(false);
      expect(isCallable([])).toBe(false);
      expect(isCallable('function')).toBe(false);
      expect(isCallable(123)).toBe(false);
      expect(isCallable(null)).toBe(false);
      expect(isCallable(undefined)).toBe(false);
    });
  });

  //#endregion
});
