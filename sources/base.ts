
declare var exports
declare var module

class 	_Base {
	_properties;
	_childs;

	constructor() {
		this._properties = [];
		this._childs = [];
	}

	addProperty(name, values) {
		this._properties.push({
			'name': 	name,
			'values': 	values
		});
	}

	addChild(selector, value) {
		this._childs.push({
			'selector': 	selector,
			'value': 		value
		});
	}

	get() {
		return ({
			'childs': 		this._childs,
			'properties': 	this._properties
		});
	}

	inherit(from) {
		this._properties = this._properties.concat(from.properties);
		this._childs = this._childs.concat(from.childs);
	}
}

module.exports._Base = _Base;




