var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
function setTabulation(nbr) {
    var data = '';
    for (var i = 0; i < nbr; i++)
        data += '\t';
    return (data);
}

/* enum for types */
var Unit;
(function (Unit) {
    Unit[Unit["None"] = 0] = "None";
    Unit[Unit["Pixel"] = 1] = "Pixel";
    Unit[Unit["Percent"] = 2] = "Percent";
    Unit[Unit["Em"] = 3] = "Em";
    Unit[Unit["Second"] = 4] = "Second";
    Unit[Unit["Point"] = 5] = "Point";
    Unit[Unit["Centimeter"] = 6] = "Centimeter";
    Unit[Unit["Millimeter"] = 7] = "Millimeter";
    Unit[Unit["Ex"] = 8] = "Ex";
    Unit[Unit["Pica"] = 9] = "Pica";
    Unit[Unit["Inch"] = 10] = "Inch";
})(Unit || (Unit = {}));

/* NODE */
var ANode = (function () {
    function ANode(type) {
        this.type = type;
    }
    return ANode;
})();

/* STRING */
var NString = (function (_super) {
    __extends(NString, _super);
    function NString(value) {
        _super.call(this, 'string');
        this.value = value;
    }
    NString.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NString: value = ' + this.value + '\n';
        return (data);
    };
    return NString;
})(ANode);

var NUrl = (function (_super) {
    __extends(NUrl, _super);
    function NUrl(value) {
        _super.call(this, value);
    }
    NUrl.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NUrl: value = ' + this.value + '\n';
        return (data);
    };
    return NUrl;
})(NString);
var NCalc = (function (_super) {
    __extends(NCalc, _super);
    function NCalc(value) {
        console.log(value);
        _super.call(this, 'calc');
        this.value = value;
    }
    NCalc.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NCalc: value = \n';
        data += this.value.toAst(align + 1);
        return (data);
    };
    return NCalc;
})(ANode);

/* NUMBER */
var NNumber = (function (_super) {
    __extends(NNumber, _super);
    function NNumber(value, unit) {
        _super.call(this, 'number');
        this.value = value;
        this.unit = (unit !== undefined ? unit : Unit.None);
    }
    NNumber.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NNumber: value = ' + this.value + ' unit = ' + this.unit + '\n';
        return (data);
    };
    return NNumber;
})(ANode);

var NPixel = (function (_super) {
    __extends(NPixel, _super);
    function NPixel(value) {
        _super.call(this, value, Unit.Pixel);
    }
    return NPixel;
})(NNumber);

var NPercent = (function (_super) {
    __extends(NPercent, _super);
    function NPercent(value) {
        _super.call(this, value, Unit.Percent);
    }
    return NPercent;
})(NNumber);

var NPoint = (function (_super) {
    __extends(NPoint, _super);
    function NPoint(value) {
        _super.call(this, value, Unit.Point);
    }
    return NPoint;
})(NNumber);

var NSecond = (function (_super) {
    __extends(NSecond, _super);
    function NSecond(value) {
        _super.call(this, value, Unit.Second);
    }
    return NSecond;
})(NNumber);

var NEm = (function (_super) {
    __extends(NEm, _super);
    function NEm(value) {
        _super.call(this, value, Unit.Em);
    }
    return NEm;
})(NNumber);

var NInch = (function (_super) {
    __extends(NInch, _super);
    function NInch(value) {
        _super.call(this, value, Unit.Inch);
    }
    return NInch;
})(NNumber);

var NCentimeter = (function (_super) {
    __extends(NCentimeter, _super);
    function NCentimeter(value) {
        _super.call(this, value, Unit.Centimeter);
    }
    return NCentimeter;
})(NNumber);

var NMillimeter = (function (_super) {
    __extends(NMillimeter, _super);
    function NMillimeter(value) {
        _super.call(this, value, Unit.Millimeter);
    }
    return NMillimeter;
})(NNumber);

var NEx = (function (_super) {
    __extends(NEx, _super);
    function NEx(value) {
        _super.call(this, value, Unit.Ex);
    }
    return NEx;
})(NNumber);

var NPica = (function (_super) {
    __extends(NPica, _super);
    function NPica(value) {
        _super.call(this, value, Unit.Pica);
    }
    return NPica;
})(NNumber);

/* COLOR */
var NColor = (function (_super) {
    __extends(NColor, _super);
    function NColor(value) {
        _super.call(this, 'color');
        this.value = value;
    }
    NColor.prototype.toAst = function (align) {
        var data = '';
        data = setTabulation(align) + 'NColor: value = #' + this.value + '\n';
        return (data);
    };
    return NColor;
})(ANode);

/* ROOT */
var NRoot = (function (_super) {
    __extends(NRoot, _super);
    function NRoot(body) {
        _super.call(this, 'root');
        this.body = body;
    }
    NRoot.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NRoot:\n';
        data += setTabulation(align) + '  body [\n';
        for (var i = 0; i < this.body.length; i++)
            data += this.body[i].toAst(align + 1);
        data += setTabulation(align) + ']\n';
        return (data);
    };

    NRoot.prototype.toJs = function () {
        for (var i = 0; i < this.body.length; i++)
            this.body[i].toJs();
    };
    return NRoot;
})(ANode);

/* BLOCK STATEMENT */
var NBlockStatement = (function (_super) {
    __extends(NBlockStatement, _super);
    function NBlockStatement(type, name, body) {
        _super.call(this, type);
        this.name = name;
        this.body = body;
    }
    return NBlockStatement;
})(ANode);

var NClass = (function (_super) {
    __extends(NClass, _super);
    function NClass(name, extend, body) {
        _super.call(this, 'class', name, body);
        this.isExtendedBy = extend;
    }
    NClass.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NClass:\n';
        data += setTabulation(align) + '  ' + '_name = ' + this.name + '\n';
        if (this.isExtendedBy !== undefined)
            data += setTabulation(align) + '  ' + '_isExtendedBy = ' + this.isExtendedBy + '\n';
        data += setTabulation(align) + '  ' + '_body = ' + '[\n';
        for (var i = 0; i < this.body.length; i++) {
            data += this.body[i].toAst(align + 1);
        }
        data += setTabulation(align) + ']\n';
        return (data);
    };
    return NClass;
})(NBlockStatement);

var NFunction = (function (_super) {
    __extends(NFunction, _super);
    function NFunction(name, ctor, arguments, childs, body, isStatic) {
        _super.call(this, 'function', name, body);
        this.arguments = arguments;
        this.isStatic = isStatic;
        this.isAConstructor = ctor;
        this.childs = childs;
    }
    NFunction.prototype.toAst = function (align) {
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
        data += setTabulation(align) + '  ]\n';
        data += setTabulation(align) + '  ' + 'body = [\n';
        for (var i = 0; i < this.body.length; i++)
            data += this.body[i].toAst(align + 1);
        data += setTabulation(align) + '  ]\n';
        return (data);
    };
    return NFunction;
})(NBlockStatement);

/* SINGLE STATEMENT */
var NSingleStatement = (function (_super) {
    __extends(NSingleStatement, _super);
    function NSingleStatement(type) {
        _super.call(this, type);
    }
    return NSingleStatement;
})(ANode);

var NImport = (function (_super) {
    __extends(NImport, _super);
    function NImport(file) {
        _super.call(this, 'import');
        this.file = file;
    }
    NImport.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NImport:\n';
        data += setTabulation(align) + '  _file = ' + this.file + '\n';
        return (data);
    };
    return NImport;
})(NSingleStatement);

var NConstant = (function (_super) {
    __extends(NConstant, _super);
    function NConstant(name, value) {
        _super.call(this, 'constant');
        this.name = name;
        this.value = value;
    }
    NConstant.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NConstant:\n';
        data += setTabulation(align) + '  ' + 'name = ' + this.name + '\n';
        data += setTabulation(align) + '  ' + 'value = \n';
        data += this.value.toAst(align + 1);
        return (data);
    };
    return NConstant;
})(NSingleStatement);

var NChild = (function (_super) {
    __extends(NChild, _super);
    function NChild(selector, value) {
        _super.call(this, 'child');
        this.selector = selector;
        this.value = value;
    }
    NChild.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NChild:\n';
        data += setTabulation(align) + '  selector = ' + this.selector + '\n';
        data += setTabulation(align) + '  value = \n';
        data += this.value.toAst(align + 1);
        return (data);
    };
    return NChild;
})(NSingleStatement);

var NValue = (function (_super) {
    __extends(NValue, _super);
    function NValue(name) {
        _super.call(this, 'value');
        this.name = name;
    }
    NValue.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NValue:\n';
        data += setTabulation(align) + '  name = ' + this.name + '\n';
        return (data);
    };
    return NValue;
})(NSingleStatement);

var NSuper = (function (_super) {
    __extends(NSuper, _super);
    function NSuper(name) {
        _super.call(this, 'super');
        this.name = name;
    }
    NSuper.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NSuper:\n';
        data += setTabulation(align) + '  name = ' + this.name + '\n';
        return (data);
    };
    return NSuper;
})(NSingleStatement);

var NProperty = (function (_super) {
    __extends(NProperty, _super);
    function NProperty(name, value) {
        _super.call(this, 'property');
        this.name = name;
        this.value = value;
    }
    NProperty.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NProperty:\n';
        data += setTabulation(align) + '  ' + 'name = ' + this.name + '\n';
        data += setTabulation(align) + '  ' + 'value = [\n';
        for (var i = 0; i < this.value.length; i++)
            data += this.value[i].toAst(align + 1);
        data += setTabulation(align) + '  ]\n';
        return (data);
    };
    return NProperty;
})(NSingleStatement);

var NFunctionCall = (function (_super) {
    __extends(NFunctionCall, _super);
    function NFunctionCall(name, arguments) {
        _super.call(this, 'functionCall');
        this.name = name;
        this.arguments = arguments;
    }
    NFunctionCall.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NFunctionCall:\n';
        data += setTabulation(align) + '  ' + 'name = ' + this.name + '\n';
        data += setTabulation(align) + '  ' + 'arguments = [\n';
        for (var i = 0; i < this.arguments.length; i++)
            data += setTabulation(align + 1) + this.arguments[i] + '\n';
        data += setTabulation(align) + '  ]\n';
        return (data);
    };
    return NFunctionCall;
})(NSingleStatement);

var NClassCall = (function (_super) {
    __extends(NClassCall, _super);
    function NClassCall(name, arguments) {
        _super.call(this, 'classCall');
        this.name = name;
        this.arguments = arguments;
    }
    NClassCall.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NClassCall:\n';
        data += setTabulation(align) + '  ' + 'name = ' + this.name + '\n';
        data += setTabulation(align) + '  ' + 'arguments = [\n';
        for (var i = 0; i < this.arguments.length; i++)
            data += setTabulation(align + 1) + arguments[i] + '\n';
        data += setTabulation(align) + '  ]\n';
        return (data);
    };
    return NClassCall;
})(NSingleStatement);

var NStaticCall = (function (_super) {
    __extends(NStaticCall, _super);
    function NStaticCall(name, method, arguments) {
        _super.call(this, 'staticCall');
        this.name = name;
        this.method = method;
        this.arguments = arguments;
    }
    NStaticCall.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NStaticCall:\n';
        data += setTabulation(align) + '  ' + 'name = ' + this.name + '\n';
        data += setTabulation(align) + '  ' + 'method = ' + this.method + '\n';
        data += setTabulation(align) + '  ' + 'arguments = [\n';
        for (var i = 0; i < this.arguments.length; i++)
            data += setTabulation(align + 1) + this.arguments[i] + '\n';
        data += setTabulation(align) + '  ]\n';
        return (data);
    };
    return NStaticCall;
})(NSingleStatement);

var NConstantCall = (function (_super) {
    __extends(NConstantCall, _super);
    function NConstantCall(name) {
        _super.call(this, 'constantCall');
        this.name = name;
    }
    NConstantCall.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NConstantCall:\n';
        data += setTabulation(align) + '  name = ' + this.name + '\n';
        return (data);
    };
    return NConstantCall;
})(NSingleStatement);

/* -- MATH -- */
var NOperator = (function (_super) {
    __extends(NOperator, _super);
    function NOperator(type, left, right) {
        _super.call(this, type);
        this.left = left;
        this.right = right;
    }
    return NOperator;
})(ANode);

var NMathPlus = (function (_super) {
    __extends(NMathPlus, _super);
    function NMathPlus(left, right) {
        _super.call(this, 'mathPlus', left, right);
    }
    NMathPlus.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NMathPlus:\n';
        data += setTabulation(align) + '  left:\n';
        data += this.left.toAst(align + 1);
        data += setTabulation(align) + '  right:\n';
        data += this.right.toAst(align + 1);
        return (data);
    };
    return NMathPlus;
})(NOperator);

var NMathMinus = (function (_super) {
    __extends(NMathMinus, _super);
    function NMathMinus(left, right) {
        _super.call(this, 'mathMinus', left, right);
    }
    NMathMinus.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NMathMinus:\n';
        data += setTabulation(align) + '  left:\n';
        data += this.left.toAst(align + 1);
        data += setTabulation(align) + '  right:\n';
        data += this.right.toAst(align + 1);
        return (data);
    };
    return NMathMinus;
})(NOperator);

var NMathMult = (function (_super) {
    __extends(NMathMult, _super);
    function NMathMult(left, right) {
        _super.call(this, 'mathMult', left, right);
    }
    NMathMult.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NMathMult:\n';
        data += setTabulation(align) + '  left:\n';
        data += this.left.toAst(align + 1);
        data += setTabulation(align) + '  right:\n';
        data += this.right.toAst(align + 1);
        return (data);
    };
    return NMathMult;
})(NOperator);

var NMathDiv = (function (_super) {
    __extends(NMathDiv, _super);
    function NMathDiv(left, right) {
        _super.call(this, 'mathDiv', left, right);
    }
    NMathDiv.prototype.toAst = function (align) {
        var data = '';
        data += setTabulation(align) + 'NMathDiv:\n';
        data += setTabulation(align) + '  left:\n';
        data += this.left.toAst(align + 1);
        data += setTabulation(align) + '  right:\n';
        data += this.right.toAst(align + 1);
        return (data);
    };
    return NMathDiv;
})(NOperator);

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
