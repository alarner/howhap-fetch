let Howhap = require('howhap');
let ErrorDisplayer = require('./error-displayer');
require('whatwg-fetch');

function makeJson(res) {
	return res.json().then(json => {
		return {res: res, json: json};
	});
}


function processResult(data) {
	if(data.res.status >= 400) {
		throw new ErrorDisplayer(data.json);
	}
	return data.json;
}

const headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

module.exports = {
	get: function(url, params) {
		url += '?';
		for(let i in params) {
			url += encodeURIComponent(i)+'='+encodeURIComponent(params[i])+'&';
		}
		url = url.slice(0, -1);
		return fetch(url, {
			credentials: 'same-origin',
			method: 'get',
			headers: headers
		})
		.then(makeJson)
		.then(processResult);
	},
	put: function(url, params) {
		return fetch(url, {
			credentials: 'same-origin',
			method: 'put',
			headers: headers,
			body: JSON.stringify(params || {})
		})
		.then(makeJson)
		.then(processResult);
	},
	post: function(url, params) {
		return fetch(url, {
			credentials: 'same-origin',
			method: 'post',
			headers: headers,
			body: JSON.stringify(params || {})
		})
		.then(makeJson)
		.then(processResult);
	},
	delete: function(url, params) {
		return fetch(url, {
			credentials: 'same-origin',
			method: 'delete',
			headers: headers,
			body: JSON.stringify(params || {})
		})
		.then(makeJson)
		.then(processResult);
	}
};