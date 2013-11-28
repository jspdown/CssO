
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

function printDebug(currentMode, debugMode, msg) {
	if (debugMode <= currentMode)
		console.log(msg);
}

class 	Csso {
	debug;
	ast;
	file;

	constructor(file, debug) {
		printDebug(this.debug, Debug.Low, '[' + this.file + '][INFO]:\tpreparing...');
		this.debug = debug;
		this.file = file;
		this.ast = undefined;
	}

	parse() {
		printDebug(this.debug, Debug.Medium, '[' + this.file + '][INFO]:\tpreparing parsing.');
		var data = fs.readFileSync(this.file, 'utf-8');
		this.ast = Parser.parse(data);
		printDebug(this.debug, Debug.Medium, '[' + this.file + '][INFO]:\tOK.');
		printDebug(this.debug, Debug.High, "########################## - AST - ##########################");
		printDebug(this.debug, Debug.High, this.ast.toAst(0));
	}

	convert() {
		if (this.ast === undefined)
			throw Error('can\'t convert file to javascript if file doesn\'t exist...');
		printDebug(this.debug, Debug.Medium, '[' + this.file + '][INFO]:\tpreparing javascript generation.');
		var data = this.ast.toJs(0);
		fs.writeFileSync(this.file + '.js', data, 'utf-8');
		printDebug(this.debug, Debug.Medium, '[' + this.file + '][INFO]:\tOK.')
		printDebug(this.debug, Debug.High, "########################## - JS - ###########################");
		printDebug(this.debug, Debug.High, data);
	}

	generate() {
		printDebug(this.debug, Debug.Medium, '[' + this.file + '][INFO]:\tpreparing Css generation.');
		var jsFile = require('../' + this.file + '.js');
		var Html = new jsFile.Html();
		printDebug(this.debug, Debug.High, "########################## - JSON - #########################");
		printDebug(this.debug, Debug.High, JSON.stringify(Html));
		printDebug(this.debug, Debug.High, "########################## - CSS - #########################");
		var css = Html.toCss('');
		fs.writeFileSync(this.file + '.css', css, 'utf-8');

	}
}

function 	main(argc, argv) {
	var beginArg = (argv[0] == 'node' ? 2 : 1);
	for (var i = beginArg; i < argc; i++) {
		var file = new Csso(argv[i], Debug.High);
		file.parse();
		file.convert();
		file.generate();
	}

}


main(process.argv.length, process.argv);



