let HowhapList = require('howhap-list');
require('whatwg-fetch');

let debug = false;

let headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

let handlers = [];

function makeJson(res) {
	let debugPromise = null;
	if(debug) {
		debugPromise = res.text().then((text) => {
			console.log('makeJson', res, text);
			return { res, json: JSON.parse(text) };
		});
	}
	
	return debugPromise || res.json().then(json => {
		return { res, json };
	});
}


function processResult(data) {
	if(debug) {
		console.log('processResult', data);
	}
	if(data.res.status >= 400) {
		handlers.filter(h => h.event === 'error').forEach(h => h.cb(data.json));
		throw new HowhapList(data.json);
	}
	return data.json;
}

function processError(err) {
	if(debug) {
		console.log('processError', err);
	}
	const error = { network: { message: err.toString(), status: 400 } };
	handlers.filter(h => h.event === 'error').forEach(h => h.cb(error));
	throw new HowhapList(error);
}

function customFetch(url, options) {
	if(debug) {
		console.log('customFetch', url, options);
	}
	return fetch(url, options)
	.then(makeJson)
	.catch(processError)
	.then(processResult);
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
	raw: function(url, options) {
		return customFetch(url, options);
	},
	setGlobalHeaders: function(newHeaders) {
		headers = Object.assign(headers, newHeaders);
	},
	deleteGlobalHeader: function(key) {
		delete headers[key];
	},
	setDebug: function(val) {
		debug = val;
	},
	on: function(event, cb) {
		handlers.push({ event, cb });
	},
	off: function(event, cb) {
		if(cb) {
			handlers = handlers.filter(h => h.event !== event && h.cb !== cb);
		}
		else {
			handlers = handlers.filter(h => h.event !== event);
		}
	}
};