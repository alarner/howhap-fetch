# howhap fetch

`npm install --save howhap-fetch`

Promise based AJAX library that supports [howhap](https://github.com/alarner/howhap) errors.

## Usage

```js
import fetch from 'howhap-fetch';

fetch.get('/api/v1/products')
.then(function(products) {
	console.log(products);
})
.catch(function(err) {
	console.log(err.display());
});
```

## Methods

* All methods are promise based.
* `.then(...)` will receive the data that was returned from the server as JSON.
* `.catch(...)` will receive a [howhap list](https://github.com/alarner/howhap-list) of errors returned from the server and supports all [howhap list methods](https://github.com/alarner/howhap-list#methods).

### fetch.get(url, data)

Make a GET request to the specified url.

* url: the url to make the request
* data: object of key/value pairs to be encoded into the url as query parameters

### fetch.post(url, data)

Make a POST request to the specified url.

* url: the url to make the request
* data: object of key/value pairs to be encoded into the body

### fetch.put(url, data)

Make a PUT request to the specified url.

* url: the url to make the request
* data: object of key/value pairs to be encoded into the body

### fetch.delete(url, data)

Make a DELETE request to the specified url.

* url: the url to make the request
* data: object of key/value pairs to be encoded into the body