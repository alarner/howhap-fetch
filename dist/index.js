'use strict';

var Howhap = require('howhap');
var ErrorDisplayer = require('./error-displayer');
require('whatwg-fetch');

function makeJson(res) {
	return res.json().then(function (json) {
		return { res: res, json: json };
	});
}

function processResult(data) {
	if (data.res.status >= 400) {
		throw new ErrorDisplayer(data.json);
	}
	return data.json;
}

var headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

module.exports = {
	get: function get(url, params) {
		url += '?';
		for (var i in params) {
			url += encodeURIComponent(i) + '=' + encodeURIComponent(params[i]) + '&';
		}
		url = url.slice(0, -1);
		return fetch(url, {
			credentials: 'same-origin',
			method: 'get',
			headers: headers
		}).then(makeJson).then(processResult);
	},
	put: function put(url, params) {
		return fetch(url, {
			credentials: 'same-origin',
			method: 'put',
			headers: headers,
			body: JSON.stringify(params || {})
		}).then(makeJson).then(processResult);
	},
	post: function post(url, params) {
		return fetch(url, {
			credentials: 'same-origin',
			method: 'post',
			headers: headers,
			body: JSON.stringify(params || {})
		}).then(makeJson).then(processResult);
	},
	delete: function _delete(url, params) {
		return fetch(url, {
			credentials: 'same-origin',
			method: 'delete',
			headers: headers,
			body: JSON.stringify(params || {})
		}).then(makeJson).then(processResult);
	}
};