var parser = require('./grammar.js').parser;
var fs = require('fs');

function main(argc, argv) {
    var begin = (argv[0] == 'node' ? 2 : 1);
    for (var i = begin; i < argc; i++) {
        console.log('####################' + argv[i] + '#######################');
        var data = fs.readFileSync(argv[i], 'utf-8');
        var ast = parser.parse(data);
        console.log(ast.toAst(0));
    }
}

main(process.argv.length, process.argv);
