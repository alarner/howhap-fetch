'use strict';

var HowhapList = require('howhap-list');
require('whatwg-fetch');

var debug = false;

var headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

var handlers = [];

function makeJson(res) {
	var debugPromise = null;
	if (debug) {
		debugPromise = res.text().then(function (text) {
			console.log('makeJson', res, text);
			return { res: res, json: JSON.parse(text) };
		});
	}

	return debugPromise || res.json().then(function (json) {
		return { res: res, json: json };
	});
}

function processResult(data) {
	if (debug) {
		console.log('processResult', data);
	}
	if (data.res.status >= 400) {
		handlers.filter(function (h) {
			return h.event === 'error';
		}).forEach(function (h) {
			return h.cb(data.json);
		});
		throw new HowhapList(data.json);
	}
	return data.json;
}

function processError(err) {
	if (debug) {
		console.log('processError', err);
	}
	var error = { network: { message: err.toString(), status: 400 } };
	handlers.filter(function (h) {
		return h.event === 'error';
	}).forEach(function (h) {
		return h.cb(error);
	});
	throw new HowhapList(error);
}

function customFetch(url, options) {
	if (debug) {
		console.log('customFetch', url, options);
	}
	return fetch(url, options).then(makeJson).catch(processError).then(processResult);
}

module.exports = {
	get: function get(url, params) {
		url += '?';
		for (var i in params) {
			url += encodeURIComponent(i) + '=' + encodeURIComponent(params[i]) + '&';
		}
		url = url.slice(0, -1);
		return customFetch(url, {
			credentials: 'same-origin',
			method: 'get',
			headers: headers
		});
	},
	put: function put(url, params) {
		return customFetch(url, {
			credentials: 'same-origin',
			method: 'put',
			headers: headers,
			body: JSON.stringify(params || {})
		});
	},
	post: function post(url, params) {
		return customFetch(url, {
			credentials: 'same-origin',
			method: 'post',
			headers: headers,
			body: JSON.stringify(params || {})
		});
	},
	delete: function _delete(url, params) {
		return customFetch(url, {
			credentials: 'same-origin',
			method: 'delete',
			headers: headers,
			body: JSON.stringify(params || {})
		});
	},
	raw: function raw(url, options, deleteContentType) {
		options.credentials = options.credentials || 'same-origin';
		options.headers = Object.assign({}, headers, options.headers || {});
		if (deleteContentType) {
			delete options.headers['Content-Type'];
		}
		return customFetch(url, options);
	},
	setGlobalHeaders: function setGlobalHeaders(newHeaders) {
		headers = Object.assign(headers, newHeaders);
	},
	deleteGlobalHeader: function deleteGlobalHeader(key) {
		delete headers[key];
	},
	setDebug: function setDebug(val) {
		debug = val;
	},
	on: function on(event, cb) {
		handlers.push({ event: event, cb: cb });
	},
	off: function off(event, cb) {
		if (cb) {
			handlers = handlers.filter(function (h) {
				return h.event !== event && h.cb !== cb;
			});
		} else {
			handlers = handlers.filter(function (h) {
				return h.event !== event;
			});
		}
	}
};