'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Howhap = require('howhap');
module.exports = function () {
	function ErrorDisplayer(err) {
		_classCallCheck(this, ErrorDisplayer);

		this.errors = {};
		err = err || {};

		for (var i in err) {
			this.errors[i] = new Howhap(err[i]);
		};
	}

	_createClass(ErrorDisplayer, [{
		key: 'display',
		value: function display(key) {
			var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

			if (!this.errors.hasOwnProperty(key)) {
				return defaultValue;
			}
			return this.errors[key].toString();
		}
	}, {
		key: 'toJSON',
		value: function toJSON() {
			var json = {};
			for (var i in this.errors) {
				json[i] = this.errors[i].toString();
			}
			return json;
		}
	}]);

	return ErrorDisplayer;
}();