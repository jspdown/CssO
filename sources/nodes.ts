declare var exports;
declare var module;


function 	setTabulation(nbr) {
	var data = '';
	for (var i = 0; i < nbr; i++)
		data += '\t';
	return (data);
}


/* enum for types */

enum 	Unit {
	None,
	Pixel,
	Percent,
	Em,
	Second,
	Point,
	Centimeter,
	Millimeter,
	Ex,
	Pica,
	Inch
}

/* NODE */

class 	ANode {
	type;

	constructor(type) {
		this.type = type;
	}
}

/* STRING */

class 	NString extends ANode {
	value;

	constructor(value) {
		super('string');
		this.value = value;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NString: value = ' + this.value + '\n';
		return (data);
	}
}

class 	NUrl extends NString {

	constructor(value) {
		super(value);
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NUrl: value = ' + this.value + '\n';
		return (data);
	}
}
class 	NCalc extends ANode {
	value;

	constructor(value) {
		console.log(value);
		super('calc');
		this.value = value;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NCalc: value = \n';
		data += this.value.toAst(align + 1);
		return (data);
	}
}

/* NUMBER */

class 	NNumber extends ANode {
	value;
	unit;

	constructor(value, unit) {
		super('number');
		this.value = value;
		this.unit = (unit !== undefined ? unit : Unit.None)
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NNumber: value = ' + this.value + ' unit = ' + this.unit + '\n';
		return (data);
	}
}

class 	NPixel extends NNumber {

	constructor(value) {
		super(value, Unit.Pixel);
	}
}

class 	NPercent extends NNumber {

	constructor(value) {
		super(value, Unit.Percent);
	}
}

class 	NPoint extends NNumber {

	constructor(value) {
		super(value, Unit.Point);
	}
}

class 	NSecond extends NNumber {

	constructor(value) {
		super(value, Unit.Second);
	}
}

class 	NEm extends NNumber {

	constructor(value) {
		super(value, Unit.Em);
	}
}

class 	NInch extends NNumber {

	constructor(value) {
		super(value, Unit.Inch);
	}
}

class 	NCentimeter extends NNumber {

	constructor(value) {
		super(value, Unit.Centimeter);
	}
}

class 	NMillimeter extends NNumber {

	constructor(value) {
		super(value, Unit.Millimeter);
	}
}

class 	NEx extends NNumber {

	constructor(value) {
		super(value, Unit.Ex);
	}
}

class 	NPica extends NNumber {

	constructor(value) {
		super(value, Unit.Pica);
	}
}
/* COLOR */

class 	NColor extends ANode {
	value;

	constructor(value) {
		super('color');
		this.value = value;
	}

	toAst(align) {
		var data = '';
		data = setTabulation(align) + 'NColor: value = #' + this.value + '\n';
		return (data);
	}
}

/* ROOT */

class 	NRoot extends ANode {
	body;

	constructor(body) {
		super('root');
		this.body = body;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NRoot:\n';
		data += setTabulation(align) + '  body [\n';
		for (var i = 0; i < this.body.length; i++) 
			data += this.body[i].toAst(align + 1);
		data += setTabulation(align) + ']\n';
		return (data);
	}

	toJs() {
		for (var i = 0; i < this.body.length; i++)
			this.body[i].toJs()
	}
}

/* BLOCK STATEMENT */

class 	NBlockStatement extends ANode {
	name;
	body;

	constructor(type, name, body) {
		super(type);
		this.name = name;
		this.body = body;
	}

	toJs(align) {
	}
}

class 	NClass extends NBlockStatement {
	isExtendedBy;

	constructor(name, extend, body) {
		super('class', name, body);
		this.isExtendedBy = extend;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NClass:\n';
		data += setTabulation(align) + '  ' + '_name = ' + this.name + '\n';
		if (this.isExtendedBy !== undefined)
			data += setTabulation(align) + '  ' + '_isExtendedBy = ' + this.isExtendedBy + '\n';
		data += setTabulation(align) + '  ' + '_body = ' + '[\n';
		for (var i = 0; i < this.body.length; i++) {
			data += this.body[i].toAst(align + 1);
		}
		data += setTabulation(align) + ']\n'
		return (data);
	}

	getConstructor() {
		for (var i = 0; i < this.body.length; i++) {
			if (this.body[i].type == 'function' && this.body[i].name == this.name)
				return (this.body[i]);
		}
		return (undefined);
	}

	toJs(align) {
		var		data = '';
		var 	ctor = this.getConstructor();

		if (ctor == undefined) {
			data += setTabulation(align) + 'function ' + this.name + '() {\n';
			for (var i = 0; i < this.body.length; i++) {
				if (this.body[i].type == 'constant')
					data += this.body[i].toJs();
			}
			data += setTabulation(align) + '}\n'
		}
		else
			data += ctor.toJs(align)

		for (var i = 0; i < this.body.length; i++) {
			if (this.body[i].type == 'function' && this.body[i].name != this.name)
				data += this.name + '.' + this.body[i].toJs(align);
		}	
		return (data);
	}
}

class 	NFunction extends NBlockStatement {
	arguments;
	isStatic;
	isAConstructor;
	childs;

	constructor(name, ctor, arguments, childs, body, isStatic) {
		super('function', name, body);
		this.arguments = arguments;
		this.isStatic = isStatic;
		this.isAConstructor = ctor;
		this.childs = childs;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NFunction:\n';
		data += setTabulation(align) + '  ' + 'name = ' + this.name + '\n';
		data += setTabulation(align) + '  ' + 'isStatic = ' + this.isStatic + '\n';
		data += setTabulation(align) + '  ' + 'isAConstructor = ' + this.isAConstructor + '\n';
		data += setTabulation(align) + '  ' + 'arguments = [\n';
		for (var i = 0; i < this.arguments.length; i++)
			data += setTabulation(align + 1) + this.arguments[i] + '\n';
		data += setTabulation(align) + '  ]\n';
		data += setTabulation(align) + '  ' + 'childs = [\n';
		for (var i = 0; i < this.childs.length; i++)
			data += this.childs[i].toAst(align + 1);
		data += setTabulation(align) + '  ]\n'
		data += setTabulation(align) + '  ' + 'body = [\n';
		for (var i = 0; i < this.body.length; i++)
			data += this.body[i].toAst(align + 1);
		data += setTabulation(align) + '  ]\n'
		return (data);
	}


}

/* SINGLE STATEMENT */

class 	NSingleStatement extends ANode {

	constructor(type) {
		super(type);
	}
}

class 	NImport extends NSingleStatement {
	file;

	constructor(file) {
		super('import');
		this.file = file;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NImport:\n';
		data += setTabulation(align) + '  _file = ' + this.file + '\n';
		return (data);
	}
}

class 	NConstant extends NSingleStatement {
	name;
	value;

	constructor(name, value) {
		super('constant');
		this.name = name;
		this.value = value;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NConstant:\n';
		data += setTabulation(align) + '  ' + 'name = ' + this.name + '\n';
		data += setTabulation(align) + '  ' + 'value = \n';
		data += this.value.toAst(align + 1);
		return (data);
	}

	toJs(align) {

	}
}

class 	NChild extends NSingleStatement {
	selector;
	value;

	constructor(selector, value) {
		super('child');
		this.selector = selector;
		this.value = value;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NChild:\n';
		data += setTabulation(align) + '  selector = ' + this.selector + '\n';
		data += setTabulation(align) + '  value = \n';
		data += this.value.toAst(align + 1);
		return (data);
	}
}

class 	NValue extends NSingleStatement {
	name;

	constructor(name) {
		super('value');
		this.name = name;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NValue:\n';
		data += setTabulation(align) + '  name = ' + this.name + '\n';
		return (data);
	}
}

class 	NSuper extends NSingleStatement {
	name;

	constructor(name) {
		super('super');
		this.name = name;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NSuper:\n';
		data += setTabulation(align) + '  name = ' + this.name + '\n';
		return (data);
	}
}

class 	NProperty extends NSingleStatement {
	name;
	value;

	constructor(name, value) {
		super('property');
		this.name = name;
		this.value = value;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NProperty:\n';
		data += setTabulation(align) + '  ' + 'name = ' + this.name + '\n';
		data += setTabulation(align) + '  ' + 'value = [\n';
		for (var i = 0; i < this.value.length; i++)
			data += this.value[i].toAst(align + 1);
		data += setTabulation(align) + '  ]\n';
		return (data);
	}
}

class 	NFunctionCall extends NSingleStatement {
	name;
	arguments;

	constructor(name, arguments) {
		super('functionCall');
		this.name = name;
		this.arguments = arguments;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NFunctionCall:\n';
		data += setTabulation(align) + '  ' + 'name = ' + this.name + '\n';
		data += setTabulation(align) + '  ' + 'arguments = [\n';
		for (var i = 0; i < this.arguments.length; i++)
			data += setTabulation(align +1) +  this.arguments[i] + '\n';
		data += setTabulation(align) + '  ]\n';
		return (data);
	}
}

class 	NClassCall extends NSingleStatement {
	name;
	arguments;

	constructor(name, arguments) {
		super('classCall');
		this.name = name;
		this.arguments = arguments;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NClassCall:\n';
		data += setTabulation(align) + '  ' + 'name = ' + this.name + '\n';
		data += setTabulation(align) + '  ' + 'arguments = [\n';
		for (var i = 0; i < this.arguments.length; i++)
			data += setTabulation(align + 1) + arguments[i] + '\n';
		data += setTabulation(align) + '  ]\n';
		return (data);
	}
}

class 	NStaticCall extends NSingleStatement {
	name;
	method;
	arguments;

	constructor(name, method, arguments) {
		super('staticCall');
		this.name = name;
		this.method = method;
		this.arguments = arguments;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NStaticCall:\n';
		data += setTabulation(align) + '  ' + 'name = ' + this.name + '\n';
		data += setTabulation(align) + '  ' + 'method = ' + this.method + '\n';
		data += setTabulation(align) + '  ' + 'arguments = [\n';
		for (var i = 0; i < this.arguments.length; i++)
			data += setTabulation(align + 1) +  this.arguments[i] + '\n'
		data += setTabulation(align) + '  ]\n';
		return (data);
	}
}

class NConstantCall extends NSingleStatement {
	name;

	constructor(name) {
		super('constantCall');
		this.name = name;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NConstantCall:\n';
		data += setTabulation(align) + '  name = ' + this.name + '\n';
		return (data);
	}
}

/* -- MATH -- */

class NOperator extends ANode {
	left;
	right;

	constructor(type, left, right) {
		super(type);
		this.left = left;
		this.right = right;
	}
}

class NMathPlus extends NOperator {

	constructor(left, right) {
		super('mathPlus', left, right);
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NMathPlus:\n';
		data += setTabulation(align) + '  left:\n';
		data += this.left.toAst(align + 1);
		data += setTabulation(align) + '  right:\n';
		data += this.right.toAst(align + 1);
		return (data);
	}
}

class NMathMinus extends NOperator {

	constructor(left, right) {
		super('mathMinus', left, right);
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NMathMinus:\n';
		data += setTabulation(align) + '  left:\n';
		data += this.left.toAst(align + 1);
		data += setTabulation(align) + '  right:\n';
		data += this.right.toAst(align + 1);
		return (data);
	}
}


class NMathMult extends NOperator {

	constructor(left, right) {
		super('mathMult', left, right);
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NMathMult:\n';
		data += setTabulation(align) + '  left:\n';
		data += this.left.toAst(align + 1);
		data += setTabulation(align) + '  right:\n';
		data += this.right.toAst(align + 1);
		return (data);
	}
}


class NMathDiv extends NOperator {

	constructor(left, right) {
		super('mathDiv', left, right);
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NMathDiv:\n';
		data += setTabulation(align) + '  left:\n';
		data += this.left.toAst(align + 1);
		data += setTabulation(align) + '  right:\n';
		data += this.right.toAst(align + 1);
		return (data);
	}
}

module.exports.NRoot = NRoot;

module.exports.NImport = NImport;
module.exports.NClass = NClass;
module.exports.NFunction = NFunction;

module.exports.NConstant = NConstant;

module.exports.NChild = NChild;
module.exports.NFunctionCall = NFunctionCall;
module.exports.NClassCall = NClassCall;
module.exports.NStaticCall = NStaticCall;
module.exports.NConstantCall = NConstantCall;
module.exports.NSuper = NSuper;
module.exports.NProperty = NProperty;

module.exports.Unit = Unit;
module.exports.NNumber = NNumber;
module.exports.NColor = NColor;
module.exports.NPercent = NPercent;
module.exports.NEm = NEm;
module.exports.NPoint = NPoint;
module.exports.NSecond = NSecond;
module.exports.NPixel = NPixel;
module.exports.NInch = NInch;
module.exports.NCentimeter = NCentimeter;
module.exports.NMillimeter = NMillimeter;
module.exports.NEx = NEx;
module.exports.NPica = NPica;

module.exports.NValue = NValue;
module.exports.NString = NString;
module.exports.NUrl = NUrl;
module.exports.NCalc = NCalc;

module.exports.NMathDiv = NMathDiv;
module.exports.NMathPlus = NMathPlus;
module.exports.NMathMinus = NMathMinus;
module.exports.NMathMult = NMathMult;
