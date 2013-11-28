
declare var exports
declare var module

class 	Base {
	_properties;
	_childs;

	constructor() {
		this._properties = [];
		this._childs = [];
	}

	addProperty(name, values) {
		this._properties.push(new Property(name, values));
	}

	addChild(selector, value) {
		this._childs.push(new Child(selector, value));
	}

	get() {
		return (new NodeElm(this._childs, this._properties));
	}

	inherit(_this, motherClass) {
		var constants = _this.constants;
		var from = motherClass.call(_this);
		for (var prop in constants)
			_this.constants[prop] = constants[prop];
		this._properties = this._properties.concat(from.properties);
		this._childs = this._childs.concat(from.childs);
	}
}

class 	NodeElm {
	childs;
	properties;

	constructor(childs, properties) {
		this.childs = childs;
		this.properties = properties;
	}

	toCss(parent_selector) {
		var data = '';
		if (parent_selector != '') {
			data += parent_selector + ' {\n';
			for (var i = 0; i < this.properties.length; i++)
				data += this.properties[i].toCss();
			data += '}\n\n';
		}
		for (var i = 0; i < this.childs.length; i++)
			data += this.childs[i].toCss(parent_selector);
		return (data);
	}
}

class 	Property {
	name;
	values;

	constructor(name, values) {
		this.name = name;
		this.values = values;
	}

	toCss() {
		var data = '';

		data += '\t' + this.name + ':\t';
		for (var i = 0; i < this.values.length; i++)
			data += this.values[i].toString() + ((i == this.values.length - 1) ? '' : ' ');
		data += ';\n';
		return (data);
	}
}

class 	Child {
	selector;
	value;

	constructor(selector, value) {
		this.selector = selector;
		this.value = value;
	}

	toCss(parent_selector) {
		var data = '';
		var separator = (this.selector[0] == ':') ? '' : ' ';
		separator = (parent_selector == '') ? '' : separator;
		data += this.value.toCss(parent_selector + separator + this.selector);
		return (data);
	}
}
/* DATA TYPE used */

interface 	Type {
	_name;
	_value;
	_unit;

	getValue();
	getName();
	toString();
}

class 	AType implements Type {
	_name;
	_value;
	_unit;

	constructor(name, unit, value) {
		this._name = name;
		this._unit = unit;
		this._value = value;
	}

	getValue() { return (this._value) }
	getName() { return (this._name) }
	toString() { return (this._value + this._unit) }
}

class 	NumericValue extends AType {}

class 	Value extends NumericValue { constructor (value) { super('value', '', value) } }
class 	Numeric extends NumericValue { constructor (value) { super('numeric', '', value) } }
class 	Pixel extends NumericValue { constructor (value) { super('pixel', 'px', value) } }
class 	Point extends NumericValue { constructor (value) { super('point', 'pt', value) } }
class 	Percent extends NumericValue { constructor (value) { super('percent', '%', value) } }
class 	Em extends NumericValue { constructor (value) { super('em', 'em', value) } }
class 	Second extends NumericValue { constructor (value) { super('second', 's', value) } }
class 	Inch extends NumericValue { constructor (value) { super('inch', 'in', value) } }
class 	Centimeter extends NumericValue { constructor (value) { super('centimeter', 'cm', value) } }
class 	Millimeter extends NumericValue { constructor (value) { super('millimeter', 'mm', value) } }
class 	Ex extends NumericValue { constructor (value) { super('ex', 'ex', value) } }
class 	Pica extends NumericValue { constructor (value) { super('pica', 'pc', value) } }

class 	STring extends AType { 
	constructor (value) { super('string', '"', value) } 
	toString() { return (this._unit + this._value + this._unit) }
}

class 	Url extends AType { 
	constructor (value) { super('url', 'url', value) } 
	toString() { return ('url("' + this._value + '")') }
}

class 	Calc extends AType { 
	constructor (value) { super('calc', 'calc', value) } 
	toString() { return ('calc()') }
}

class 	Color extends AType { 
	constructor (value) { super('color', '#', value) } 
	toString() { return (this._unit + this._value); }
}

var 	TypeList = {
	'value': { class: Value, unit: '' },
	'numeric': { class: Numeric, unit: '' },
	'pixel': { class: Pixel, unit: 'px' },
	'point': { class: Point, unit: 'pt' },
	'percent': { class: Percent, unit: '%' },
	'em': { class: Em, unit: 'em' },
	'second': { class: Second, unit: 's' },
	'inch': { class: Inch, unit: 'in' },
	'centimeter': { class: Centimeter, unit: 'cm' },
	'millimeter': { class: Millimeter, unit: 'mm' },
	'ex': { class: Ex, unit: 'ex' },
	'pica': { class: Pica, unit: 'pc' },
	'string': { class: STring, unit: '"' },	
	'url': { class: Value, unit: 'url' },
	'calc': { class: Value, unit: 'calc' },
}

class 	Factory {

	static create(name, value) {
		try {
			return (new TypeList[name].class(value));
		} catch (e) {
			throw Error('unknow type ' + name);
		}
	}
}


function 	Add(left, right) {
	console.log('add left --->', left);
	console.log('add right -->', right);
	if (left.getName() == right.getName())
		return (Factory.create(left.getName(), left.getValue() + right.getValue()));
	else if (left instanceof Numeric && right instanceof NumericValue)
		return (Factory.create(right.getName(), left.getValue() + right.getValue()));
	else if (right instanceof Numeric && left instanceof NumericValue)
		return (Factory.create(left.getName(), left.getValue() + right.getValue()));
	else
		throw Error('can not add ' + left.toString() + ' and ' + right.toString() + '.');
}


function 	Sub(left, right) {
	console.log('sub left --->', left);
	console.log('sub right -->', right);
	if (left.getName() == right.getName())
		return (Factory.create(left.getName(), left.getValue() - right.getValue()));
	else if (left instanceof Numeric && right instanceof NumericValue)
		return (Factory.create(right.getName(), left.getValue() - right.getValue()));
	else if (right instanceof Numeric && left instanceof NumericValue)
		return (Factory.create(left.getName(), left.getValue() - right.getValue()));
	else
		throw Error('can not sub ' + left.toString() + ' and ' + right.toString() + '.');
}

function 	Mult(left, right) {
	console.log('mult left --->', left);
	console.log('mult right -->', right);
	if (left.getName() == right.getName())
		return (Factory.create(left.getName(), left.getValue() * right.getValue()));
	else if (left instanceof Numeric && right instanceof NumericValue)
		return (Factory.create(right.getName(), left.getValue() * right.getValue()));
	else if (right instanceof Numeric && left instanceof NumericValue)
		return (Factory.create(left.getName(), left.getValue() * right.getValue()));
	else
		throw Error('can not mult ' + left.toString() + ' and ' + right.toString() + '.');
}

function 	Div(left, right) {
	console.log('div left --->', left);
	console.log('div right -->', right);
	if (left.getName() == right.getName())
		return (Factory.create(left.getName(), left.getValue() / right.getValue()));
	else if (left instanceof Numeric && right instanceof NumericValue)
		return (Factory.create(right.getName(), left.getValue() / right.getValue()));
	else if (right instanceof Numeric && left instanceof NumericValue)
		return (Factory.create(left.getName(), left.getValue() / right.getValue()));
	else
		throw Error('can not div ' + left.toString() + ' and ' + right.toString() + '.');
}


module.exports.Base = Base;
module.exports.Mult = Mult;
module.exports.Add = Add;
module.exports.Sub = Sub;
module.exports.Div = Div;

module.exports.Value = Value;
module.exports.Numeric = Numeric;
module.exports.Pixel = Pixel;
module.exports.Point = Point;
module.exports.Percent = Percent;
module.exports.Em = Em;
module.exports.Second = Second;
module.exports.Inch = Inch;
module.exports.Centimeter = Centimeter;
module.exports.Millimeter = Millimeter;
module.exports.Ex = Ex;
module.exports.Pica = Pica;
module.exports.STring = STring;
module.exports.Url = Url;
module.exports.Calc = Calc;
module.exports.Color = Color;



