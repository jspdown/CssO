var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Base = (function () {
    function Base() {
        this._properties = [];
        this._childs = [];
    }
    Base.prototype.addProperty = function (name, values) {
        this._properties.push(new Property(name, values));
    };

    Base.prototype.addChild = function (selector, value) {
        this._childs.push(new Child(selector, value));
    };

    Base.prototype.get = function () {
        return (new NodeElm(this._childs, this._properties));
    };

    Base.prototype.inherit = function (_this, motherClass) {
        var constants = _this.constants;
        var from = motherClass.call(_this);
        for (var prop in constants)
            _this.constants[prop] = constants[prop];
        this._properties = this._properties.concat(from.properties);
        this._childs = this._childs.concat(from.childs);
    };
    return Base;
})();

var NodeElm = (function () {
    function NodeElm(childs, properties) {
        this.childs = childs;
        this.properties = properties;
    }
    NodeElm.prototype.toCss = function (parent_selector) {
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
    };
    return NodeElm;
})();

var Property = (function () {
    function Property(name, values) {
        this.name = name;
        this.values = values;
    }
    Property.prototype.toCss = function () {
        var data = '';

        data += '\t' + this.name + ':\t';
        for (var i = 0; i < this.values.length; i++) {
            console.log('-----#> ', this.values[i]);
            data += this.values[i].toString() + ' ';
        }
        data += ';\n';
        return (data);
    };
    return Property;
})();

var Child = (function () {
    function Child(selector, value) {
        this.selector = selector;
        this.value = value;
    }
    Child.prototype.toCss = function (parent_selector) {
        var data = '';
        data += this.value.toCss(parent_selector + ' ' + this.selector);
        return (data);
    };
    return Child;
})();

var AType = (function () {
    function AType(name, unit, value) {
        this._name = name;
        this._unit = unit;
        this._value = value;
    }
    AType.prototype.getValue = function () {
        return (this._value);
    };
    AType.prototype.getName = function () {
        return (this._name);
    };
    AType.prototype.toString = function () {
        return (this._value + this._unit);
    };
    return AType;
})();

var NumericValue = (function (_super) {
    __extends(NumericValue, _super);
    function NumericValue() {
        _super.apply(this, arguments);
    }
    return NumericValue;
})(AType);

var Value = (function (_super) {
    __extends(Value, _super);
    function Value(value) {
        _super.call(this, 'value', '', value);
    }
    return Value;
})(NumericValue);
var Numeric = (function (_super) {
    __extends(Numeric, _super);
    function Numeric(value) {
        _super.call(this, 'numeric', '', value);
    }
    return Numeric;
})(NumericValue);
var Pixel = (function (_super) {
    __extends(Pixel, _super);
    function Pixel(value) {
        _super.call(this, 'pixel', 'px', value);
    }
    return Pixel;
})(NumericValue);
var Point = (function (_super) {
    __extends(Point, _super);
    function Point(value) {
        _super.call(this, 'point', 'pt', value);
    }
    return Point;
})(NumericValue);
var Percent = (function (_super) {
    __extends(Percent, _super);
    function Percent(value) {
        _super.call(this, 'percent', '%', value);
    }
    return Percent;
})(NumericValue);
var Em = (function (_super) {
    __extends(Em, _super);
    function Em(value) {
        _super.call(this, 'em', 'em', value);
    }
    return Em;
})(NumericValue);
var Second = (function (_super) {
    __extends(Second, _super);
    function Second(value) {
        _super.call(this, 'second', 's', value);
    }
    return Second;
})(NumericValue);
var Inch = (function (_super) {
    __extends(Inch, _super);
    function Inch(value) {
        _super.call(this, 'inch', 'in', value);
    }
    return Inch;
})(NumericValue);
var Centimeter = (function (_super) {
    __extends(Centimeter, _super);
    function Centimeter(value) {
        _super.call(this, 'centimeter', 'cm', value);
    }
    return Centimeter;
})(NumericValue);
var Millimeter = (function (_super) {
    __extends(Millimeter, _super);
    function Millimeter(value) {
        _super.call(this, 'millimeter', 'mm', value);
    }
    return Millimeter;
})(NumericValue);
var Ex = (function (_super) {
    __extends(Ex, _super);
    function Ex(value) {
        _super.call(this, 'ex', 'ex', value);
    }
    return Ex;
})(NumericValue);
var Pica = (function (_super) {
    __extends(Pica, _super);
    function Pica(value) {
        _super.call(this, 'pica', 'pc', value);
    }
    return Pica;
})(NumericValue);

var STring = (function (_super) {
    __extends(STring, _super);
    function STring(value) {
        _super.call(this, 'string', '"', value);
    }
    STring.prototype.toString = function () {
        return (this._unit + this._value + this._unit);
    };
    return STring;
})(AType);

var Url = (function (_super) {
    __extends(Url, _super);
    function Url(value) {
        _super.call(this, 'url', 'url', value);
    }
    Url.prototype.toString = function () {
        return ('url("' + this._value + '")');
    };
    return Url;
})(AType);

var Calc = (function (_super) {
    __extends(Calc, _super);
    function Calc(value) {
        _super.call(this, 'calc', 'calc', value);
    }
    Calc.prototype.toString = function () {
        return ('calc()');
    };
    return Calc;
})(AType);

var Color = (function (_super) {
    __extends(Color, _super);
    function Color(value) {
        _super.call(this, 'color', '#', value);
    }
    Color.prototype.toString = function () {
        return (this._unit + this._value);
    };
    return Color;
})(AType);

var TypeList = {
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
    'calc': { class: Value, unit: 'calc' }
};

var Factory = (function () {
    function Factory() {
    }
    Factory.create = function (name, value) {
        try  {
            return (new TypeList[name].class(value));
        } catch (e) {
            throw Error('unknow type ' + name);
        }
    };
    return Factory;
})();

function Add(left, right) {
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

function Sub(left, right) {
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

function Mult(left, right) {
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

function Div(left, right) {
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
