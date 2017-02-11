let HowhapList = require('howhap-list');
require('whatwg-fetch');

let debug = false;

let headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

function makeJson(res) {
	if(debug) {
		console.log('makeJson', res);
	}
	return res.json().then(json => {
		return {res: res, json: json};
	});
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
		.then(processResult)
		.catch(processError);
	},
	put: function(url, params) {
		return fetch(url, {
			credentials: 'same-origin',
			method: 'put',
			headers: headers,
			body: JSON.stringify(params || {})
		})
		.then(makeJson)
		.then(processResult)
		.catch(processError);
	},
	post: function(url, params) {
		return fetch(url, {
			credentials: 'same-origin',
			method: 'post',
			headers: headers,
			body: JSON.stringify(params || {})
		})
		.then(makeJson)
		.then(processResult)
		.catch(processError);
	},
	delete: function(url, params) {
		return fetch(url, {
			credentials: 'same-origin',
			method: 'delete',
			headers: headers,
			body: JSON.stringify(params || {})
		})
		.then(makeJson)
		.then(processResult)
		.catch(processError);
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