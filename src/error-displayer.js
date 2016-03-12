module.exports = class ErrorDisplayer {
	constructor(err) {
		this.errors = {};
		err = err || {};

		for(var i in err) {
			this.errors[i] = new Howhap(err[i]);
		};
	}

	display(key, defaultValue = '') {
		if(!this.errors.hasOwnProperty(key)) {
			return defaultValue;
		}
		return this.errors[key].toString();
	}

	toJSON() {
		let json = {};
		for(let i in this.errors) {
			json[i] = this.errors[i].toString();
		}
		return json;
	}
};