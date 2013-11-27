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
	Inch,
	String,
	Color,
	Calc,
	Url
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
	unit;

	constructor(value) {
		super('string');
		this.value = value;
		this.unit = Unit.String;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NString: value = ' + this.value + '\n';
		return (data);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.STring(' + this.value + ')') }
	toString() { return ('"' + this.value + '"') }
}

class 	NUrl extends ANode {
	value;
	unit;

	constructor(value) {
		super('url');
		this.value = value;
		this.unit = Unit.Url;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NUrl: value = ' + this.value + '\n';
		return (data);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.Url(' + this.value + ')') }
	toString() { return ('url(' + this.value + ')') }
}

class 	NCalc extends ANode {
	value;
	unit;

	constructor(value) {
		super('calc');
		this.value = value;
		this.unit = Unit.Calc;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NCalc: value = \n';
		data += this.value.toAst(align + 1);
		return (data);
	}
	toJs(align) { return (setTabulation(align) + 'new _base.Calc(' + ')') }
	toString() { return ('calc()') }
}

/* NUMBER */

class 	NNumber extends ANode {
	value;
	unit;

	constructor(value, unit) {
		super('number');
		this.value = value;
		this.unit = unit;
	}

	toAst(align) {
		var data = '';
		data += setTabulation(align) + 'NNumber: value = ' + this.value + ' unit = ' + this.unit + '\n';
		return (data);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.Numeric(' + this.value + ')') }
	toString() { return (this.value + '') }
}

class 	NPixel extends NNumber {

	constructor(value) {
		super(value, Unit.Pixel);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.Pixel(' + this.value + ')') }
	toString() { return (this.value + 'px') }
}

class 	NPercent extends NNumber {

	constructor(value) {
		super(value, Unit.Percent);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.Percent(' + this.value + ')') }
	toString() { return (this.value + '%') }
}

class 	NPoint extends NNumber {

	constructor(value) {
		super(value, Unit.Point);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.Point(' + this.value + ')') }
	toString() { return (this.value + 'pt') }
}

class 	NSecond extends NNumber {

	constructor(value) {
		super(value, Unit.Second);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.Second(' + this.value + ')') }
	toString() { return (this.value + 's') }
}

class 	NEm extends NNumber {

	constructor(value) {
		super(value, Unit.Em);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.Em(' + this.value + ')') }
	toString() { return (this.value + 'em') }
}

class 	NInch extends NNumber {

	constructor(value) {
		super(value, Unit.Inch);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.Inch(' + this.value + ')') }
	toString() { return (this.value + 'in') }
}

class 	NCentimeter extends NNumber {

	constructor(value) {
		super(value, Unit.Centimeter);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.Centimeter(' + this.value + ')') }
	toString() { return (this.value + 'cm') }
}

class 	NMillimeter extends NNumber {

	constructor(value) {
		super(value, Unit.Millimeter);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.Millimeter(' + this.value + ')') }
	toString() { return (this.value + 'mm') }
}

class 	NEx extends NNumber {

	constructor(value) {
		super(value, Unit.Ex);
	}

	toJs(align) { return (setTabulation(align) + 'new Ex(' + this.value + ')') }
	toString() { return (this.value + 'ex') }
}

class 	NPica extends NNumber {

	constructor(value) {
		super(value, Unit.Pica);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.Pica(' + this.value + ')') }
	toString() { return (this.value + 'pc') }
}
/* COLOR */

class 	NColor extends ANode {
	value;
	type;

	constructor(value) {
		super('color');
		this.value = value;
		this.type = Unit.Color;
	}

	toAst(align) {
		var data = '';
		data = setTabulation(align) + 'NColor: value = #' + this.value + '\n';
		return (data);
	}

	toJs(align) { return (setTabulation(align) + 'new _base.Color("' + this.value + '")') }
	toString() { return ('#' + this.value) }
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

	toJs(align) {
		var modules = [];
		var data = '';
		//base
		data += 'var _base = require("../bin/base.js");\n\n';
		data += 'console.log(_base.Pixel(2));\n';
		//classes and imports
		for (var i = 0; i < this.body.length; i++) {
			if (this.body[i].type == 'class')
				modules.push(this.body[i].name)
			data += this.body[i].toJs(align);
		}
		for (var i = 0; i < modules.length; i++) 
			data += 'module.exports.' + modules[i] + ' = ' + modules[i] + ';\n';
		return (data);
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

	getConstant() {
		var cst = [];
		for (var i = 0; i < this.body.length; i++) {
			if (this.body[i].type == 'constant')
				cst.push(this.body[i].toJs(0));
		}
		return (cst);
	}

	toJs(align) {
		var		data = ''; 										//used for javascript output
		var 	constant = []; 									//used for generated constant
		var 	ctor = this.getConstructor(); 					//contain constructor

		//render constant
		constant = this.getConstant();
		//find constructor or create a default constructor
		if (ctor == undefined)
			ctor = new NFunction(this.name, true, [], [], [], false);
		//generate constructor
		ctor.constant = constant;
		ctor.isExtendedBy = this.isExtendedBy;
		data += 'var ' + ctor.name + ' = ' + ctor.toJs(align);
		//inheritance
		if (this.isExtendedBy !== undefined)
			data += '\n' + this.name + '.prototype = Object.create(' + this.isExtendedBy + '.prototype);\n\n';
		//generate methods
		for (var i = 0; i < this.body.length; i++) {
			if (this.body[i].type == 'function' && this.body[i].name != this.name)
				data += this.name + '.prototype.' + this.body[i].name + ' = ' + this.body[i].toJs(align);
		}
		return (data);
	}
}

class 	NFunction extends NBlockStatement {
	arguments;
	isStatic;
	isExtendedBy;
	isAConstructor;
	childs;
	constant;

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

	callSuper(align) {
		var data = '';
		var nbrSuper = [];

		for (var i = 0; i < this.body.length; i++) {
			if (this.body[i].type == 'super')
				nbrSuper.push(this.body[i]);
		}
		if (this.isExtendedBy !== undefined) {
			if (nbrSuper.length > 1)
				throw Error('can\'t call Super() more than one time per constructor');
			nbrSuper[0].isExtendedBy = this.isExtendedBy;
			data += nbrSuper[0].toJs(align);
		}
		else {
			if (nbrSuper.length != 0)
				throw Error('can\'t call Super() without inheritance');
		}

		return (data);
	}

	toJs(align) {
		var data = '';

		//generate function
		data += setTabulation(align) + 'function ' + '(';
		//generate arguments
		if (this.arguments.length > 0) {
			data += this.arguments[0];
			for (var i = 1; i < this.arguments.length; i++)
				data += ', ' + this.arguments[i];
		}
		data += ') {\n';
		//generate base
		data += setTabulation(align + 1) + 'var _this = new _base.Base();\n';
		if (this.isAConstructor == true)
			data += setTabulation(align + 1) + 'this.constants = {};\n';
		//redefining paramters
		if (this.arguments.length > 0) {
			for (var i = 0; i < this.arguments.length; i++)
				data += 'this.constants.' + this.arguments[i] + ' = ' + this.arguments[i] + ';\n';
		}
		//declare constant
		if (this.constant != undefined) {
			for (var i = 0; i < this.constant.length; i++)
				data += setTabulation(align + 1) + this.constant[i] + ';\n';
		}
		//generate properties
		data += '\n';
		for (var i = 0; i < this.body.length; i++) {
			if (this.body[i].type == 'super')
				data += this.callSuper(align + 1);
			else
				data += this.body[i].toJs(align + 1);
		}
		//generate childs
		data += 'console.log("####> ' + this.name  + '", this);\n';
		data += '\n';
		for (var i = 0; i < this.childs.length; i++)
			data += this.childs[i].toJs(align + 1);
		//return properties
		data += setTabulation(align + 1) + 'return (_this.get());\n';
		//end
		data += setTabulation(align) + '}\n';
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

	getFileBaseName() {
		return (this.file.split('"')[1].split('.')[0]);
	}

	toJs(align) {
		var data = '';
		data += setTabulation(align) + 'var ' + this.getFileBaseName() + ' = ' + 'require("' + this.getFileBaseName()+ '.js");\n';
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
		var data = '';
		data += setTabulation(align) + 'this.constants.' + this.name + ' = ' + this.value.toJs(0);
		return (data);
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

	toJs(align) {
		var data = '';
		data += setTabulation(align) + '_this.addChild(' + this.selector + ', ' + this.value.toJs(0) + ');\n';
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

	toJs(align) {
		return (setTabulation(align) + 'new _base.Value("' + this.name + '")');
	}
}

class 	NSuper extends NSingleStatement {
	name;
	isExtendedBy;

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

	toJs(align) {
		var data = '';
		if (this.isExtendedBy !== undefined)
			data += setTabulation(align) + '_this.inherit(this, ' + this.isExtendedBy + ');\n';
		else
			throw Error('can\'t call Super without inheritance');
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

	toJs(align) {
		var data = '';
		data += setTabulation(align) + '_this.addProperty("' + this.name + '", [';
		for (var i = 0; i < this.value.length; i++) {
			if (i == this.value.length - 1)
				data += this.value[i].toJs(0);
			else
				data += this.value[i].toJs(0) + ', ';
		}
		data += ']);\n';
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
			data += setTabulation(align +1) + this.arguments[i] + '\n';
		data += setTabulation(align) + '  ]\n';
		return (data);
	}

	toJs(align) {
		var data = '';
		data += setTabulation(align) + 'this.' + this.name + '(';
		if (this.arguments.length > 0) {
			data += 'this.constants.' + this.arguments[0]
			for (var i = 1; i < this.arguments.length; i++)
				data += ', this.constants.' + this.arguments[i];
		}
		data += ')';
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

	toJs(align) {
		var data = '';
		data += setTabulation(align) + 'new ' + this.name + '('
		if (this.arguments.length > 0) {
			data += 'this.constants.' + this.arguments[0]
			for (var i = 1; i < this.arguments.length; i++)
				data += ', this.constants.' + this.arguments[i];
		}
		data += ')';
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
			data += setTabulation(align + 1) + this.arguments[i] + '\n'
		data += setTabulation(align) + '  ]\n';
		return (data);
	}

	toJs(align) {
		var data = '';
		data += setTabulation(align) + this.name + '.' + this.method + '(';
		if (this.arguments.length > 0) {
			data += 'this.constants.' + this.arguments[0]
			for (var i = 1; i < this.arguments.length; i++)
				data += ', this.constants.' + this.arguments[i];
		}
		data += ')';
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

	toJs(align) {
		return (setTabulation(align) + 'this.constants.' + this.name);
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

	toJs(align) {
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

	toJs(align) {
		return ('_base.Add(' + this.left.toJs() + ', ' + this.right.toJs() + ')');
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

	toJs(align) {
		return ('_base.Sub(' + this.left.toJs() + ', ' + this.right.toJs() + ')');
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

	toJs(align) {
		return ('_base.Mult(' + this.left.toJs() + ', ' + this.right.toJs() + ')');
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

	toJs(align) {
		return ('_base.Div(' + this.left.toJs() + ', ' + this.right.toJs() + ')');
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
