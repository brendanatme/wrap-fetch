# Wrap Fetch

Wrap a fetch API to simplify GET, POST, UPDATE, DELETE requests

## Usage

```javascript
import { wrapFetch } from '@brendanatme/wrap-fetch';

const myFetchFunction = fetch;
const myBaseUrl = 'http://localhost:3000';
const myOptions = {
  headers: {
    'x-api-key': 'myApiKey, etc.',
  },
};

const beforeHook = (method, url) => console.log(`myApi: ${method} ${url}`);

const myApi = wrapFetch(myFetchFunction, myBaseUrl, myOptions, beforeHook);

// ...

const got = await myApi.get('/my-get-endpoint');

// ...

const posted = await myApi.post('/my-post-endpoint', {
  foo: 'bar',
});

```
