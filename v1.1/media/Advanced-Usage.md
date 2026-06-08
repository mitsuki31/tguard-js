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
import { isArrayOf, isString, isNumber } from 'tguard-js';

const isStringOrNumber = (v: any): v is string | number =>
  isString(v) || isNumber(v);

if (isArrayOf(data, isStringOrNumber)) {
  // data is (string | number)[]
  data.forEach(...);
}
```

## Validating Complex Objects

### Simple Validation

```typescript
import { isRecord, isString, isNumber } from 'tguard-js';

function validateConfig(config: unknown): config is {
  name: string;
  port: number;
  host: string;
  [key: string]: unknown;  // remove it if want strictness
} {
  return (
    isRecord(config) &&
    isString(config.name) &&
    isNumber(config.port) &&
    isString(config.host)
  );
}
```

### More Flexible & Robust Validation

```typescript
import { hasShape, isString, isNumber } from 'tguard-js';

function validateConfig(config: unknown): config is {
  name: string;
  port: number;
  host: string;
  [key: string]: unknown;  // remove it if want strictness
} {
  return hasShape(config, {
    name: isString,
    port: isNumber,
    host: isString,
  });
}
```

## Error Handling

```typescript
import { normalizeError } from 'tguard-js';

try {
  // Some operation that might throws
} catch (err) {
  // Handle any thrown value
  const error = normalizeError(err);
  console.error(error.message);
  console.error(error.cause);
}
```

## Validating API Responses

```typescript
import {
  hasShape, isString, isNumber,
  isArray, isArrayOf
} from 'tguard-js';

interface User {
  id: number;
  name: string;
  email: string;
}

function isUser(value: any): value is User {
  return hasShape(value, {
    id: isNumber,
    name: isString,
    email: isString,
  });
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
import { isEnvDefined } from 'tguard-js';

function validateEnv() {
  if (!isEnvDefined(process.env.API_URL)) {
    throw new Error('API_URL environment variable must be set');
  }

  const config = {
    // API_URL can now be safely consumed
    apiUrl: process.env.API_URL,
    port: parseInt(process.env.PORT || '3000'),
    debug: process.env.DEBUG === 'true',
  };

  return config;
}
```

## Handling Unknown Thrown Values

```typescript
import { ensureError } from 'tguard-js';

async function safeExecute(fn: async () => Promise<any>) {
  try {
    return await fn();
  } catch (err) {
    // Any value can be thrown in JS, not just Error objects
    const error = ensureError(err);
    logger.error('Execution failed', {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    throw error;
  }
}
```
