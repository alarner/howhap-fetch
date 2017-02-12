let HowhapList = require('howhap-list');
require('whatwg-fetch');

let debug = false;

let headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

function makeJson(res) {
	let debugPromise = null;
	if(debug) {
		debugPromise = res.text().then((text) => {
			console.log('makeJson', res, text);
		});
	}
	
	const resultPromise = res.json().then(json => {
		return {res: res, json: json};
	});
	return debugPromise ? debugPromise.then(() => resultPromise) : resultPromise;
}


function processResult(data) {
	if(debug) {
		console.log('processResult', data);
	}
	if(data.res.status >= 400) {
		throw new HowhapList(data.json);
	}
	return data.json;
}

function processError(err) {
	if(debug) {
		console.log('processError', err);
	}
	throw new HowhapList({ network: { message: err.toString(), status: 400 } });
}

function customFetch(url, options) {
	if(debug) {
		console.log('customFetch', url, options);
	}
	return fetch(url, options)
	.then(makeJson)
	.then(processResult)
	.catch(processError);
}

module.exports = {
	get: function(url, params) {
		url += '?';
		for(let i in params) {
			url += encodeURIComponent(i)+'='+encodeURIComponent(params[i])+'&';
		}
		url = url.slice(0, -1);
		return customFetch(url, {
			credentials: 'same-origin',
			method: 'get',
			headers: headers
		});
	},
	put: function(url, params) {
		return customFetch(url, {
			credentials: 'same-origin',
			method: 'put',
			headers: headers,
			body: JSON.stringify(params || {})
		});
	},
	post: function(url, params) {
		return customFetch(url, {
			credentials: 'same-origin',
			method: 'post',
			headers: headers,
			body: JSON.stringify(params || {})
		});
	},
	delete: function(url, params) {
		return customFetch(url, {
			credentials: 'same-origin',
			method: 'delete',
			headers: headers,
			body: JSON.stringify(params || {})
		});
	},
	setGlobalHeaders: function(newHeaders) {
		headers = Object.assign(headers, newHeaders);
	},
	deleteGlobalHeader: function(key) {
		delete headers[key];
	},
	setDebug: function(val) {
		debug = val;
	}
};