// Smoke test for Node v14

const assert = require('assert');
const tg = require('../dist');

assert.strictEqual(tg.isString('hello from test'), true);
assert.strictEqual(tg.isErrorLike({ message: 'This is error' }), true);
assert.strictEqual(tg.isFunction(() => {}), true);
assert.strictEqual(tg.isClass(function () {}), false);
assert.match(tg.ensureError(null).message, /unknown error/i);

console.log('Smoke test passed');
