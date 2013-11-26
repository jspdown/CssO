
declare var require;
declare var process;

var Parser 	= require('./grammar.js').parser;
var fs		= require('fs');


enum	Debug {
	None,
	Low,
	Medium,
	High
};

console.prototype.debug = function (currentMode, debugMode, msg) {
	if (currentMode <= debugMode)
		console.log(msg);
}

class 	Csso {
	debug;
	ast;
	file;

	constructor(file, debug) {
		console.debug(this.debug, Debug.Low, '[' + this.file + '][INFO]:\tpreparing...');
		this.debug = debug;
		this.file = file;
		this.ast = undefined;
		return (this);
	}

	parse() {
		console.debug(this.debug, Debug.Medium, '[' + this.file + '][INFO]:\tpreparing parsing.');
		var data = fs.readFileSync(this.file, 'utf-8');
		this.ast = Parser.parse(data);
		console.debug(this.debug, Debug.Medium, '[' + this.file + '][INFO]:\tOK.');
		console.debug(this.debug, Debug.High, "########################## - AST - ##########################");
		console.debug(this.debug, Debug.High, this.ast.toAst(0));
		return (this);
	}

	convert() {
		if (this.ast === undefined)
			throw Error('can\'t convert file to javascript if file doesn\'t exist...');
		console.debug(this.debug, Debug.Medium, '[' + this.file + '][INFO]:\tpreparing javascript generation.')
		var data = this.ast.toJs(0);
		fs.writeFileSync(this.file + '.js', data, 'utf-8');
		console.debug(this.debug, Debug.Medium, '[' + this.file + '][INFO]:\tOK.')
		console.debug(this.debug, Debug.High, "########################## - JS - ###########################");
		console.debug(this.debug, Debug.High, data);
	}

	generate() {
		console.debug(this.debug, Debug.Medium, '[' + this.file + '][INFO]:\tpreparing Css generation.');
		var jsFile = require(this.file + '.js');
		var Html = new jsFile.Html();
		console.debug(this.debug, Debug.High, "########################## - JSON - #########################");
		console.debug(this.debug, Debug.High, Html);
	}
}

function 	main(argc, argv) {
	var beginArg = (argv[0] == 'node' ? 2 : 1);
	for (var i = beginArg; i < argc; i++) {
		new Csso(argv[i], Debug.High).parse().convert().generate();
	}

}


main(process.argv.length, process.argv);



