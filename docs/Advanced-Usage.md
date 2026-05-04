# Advanced Usage

## Type Narrowing

Type guards work with TypeScript for automatic type narrowing:

```typescript
function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string here
    console.log(value.length);
  } else if (isNumber(value)) {
    // TypeScript knows value is number here
    console.log(value.toFixed(2));
  }
}
```

## Custom Array Validation

```typescript
import { isArrayOf, isString, isNumber } from 'typeguard-js';

const isStringOrNumber = (v: any): v is string | number =>
  isString(v) || isNumber(v);

if (isArrayOf(data, isStringOrNumber)) {
  // data is (string | number)[]
  data.forEach(...);
}
```

## Validating Complex Objects

```typescript
import { isRecord, isString, isNumber } from 'typeguard-js';

function validateConfig(config: unknown) {
  return (
    isRecord(config) &&
    isString(config.name) &&
    isNumber(config.port) &&
    isString(config.host)
  );
}
```

## Error Handling

```typescript
import { normalizeError } from 'typeguard-js';

try {
  // Some operation that might throws
} catch (err) {
  // Handle any thrown value
  const error = normalizeError(err);
  console.error(error.message);
  console.error(error.cause || error._cause);
}
```

## Validating API Responses

```typescript
import {
  isRecord, isString, isNumber,
  isArray, isArrayOf
} from 'typeguard-js';

interface User {
  id: number;
  name: string;
  email: string;
}

function isUser(value: any): value is User {
  return (
    isRecord(value) &&
    isNumber(value.id) &&
    isString(value.name) &&
    isString(value.email)
  );
}

function handleUsers(response: unknown) {
  if (isArray(response) && isArrayOf(response, isUser)) {
    // response is User[]
    response.forEach(user => console.log(user.name));
  }
}
```

## Validating Environment Configuration

```typescript
import { isString, isNumber, isNonNullish } from 'typeguard-js';
import { isEnvDefined } from 'typeguard-js';

function validateEnv() {
  const config = {
    apiUrl: process.env.API_URL,
    port: parseInt(process.env.PORT || '3000'),
    debug: process.env.DEBUG === 'true',
  };

  if (!isEnvDefined(config.apiUrl)) {
    throw new Error('API_URL environment variable must be set');
  }

  return config;
}
```

## Handling Unknown Thrown Values

```typescript
import { ensureError } from 'typeguard-js';

async function safeExecute(fn: async () => Promise<any>) {
  try {
    return await fn();
  } catch (err) {
    // Any value can be thrown in JS, not just Error objects
    const error = ensureError(err);
    logger.error('Execution failed', {
      message: error.message,
      stack: error.stack,
      originalCause: error.cause || error._cause,
    });

    throw error;
  }
}
```
