


%{
	var NNode = require('./nodes.js')
%}


%lex

%%

\s+ 						/* skip spacer */
"//".*\n					/* skip comments */
<<EOF>> 						return 'EOF';

"Import" 						return 'IMPORT';
"Class" 						return 'CLASS';
"Extends"						return 'EXTENDS';
"Function" 						return 'FUNCTION';
"Static" 						return 'STATIC';
"Super"							return 'SUPER';
"New" 							return 'NEW';

"calc" 							return 'CALC';
"url" 							return 'URL';

"px" 							return 'PIXEL';
"in" 							return 'INCH';
"cm" 							return 'CENTIMETER';
"mm"							return 'MILLIMETER';
"ex" 							return 'EX';
"pc" 							return 'PICA';
"em"							return 'EM';
"%"								return 'PERCENT';
"pt"							return 'POINTS';
"s"								return 'SECOND';

"{"								return 'L_CURLY_BRACKET';
"}"								return 'R_CURLY_BRACKET';
"(" 							return 'L_PAR';
")"								return 'R_PAR';

":"								return 'DOUBLE_DOT';
"->"							return 'ARROW';
";"								return 'SEMI_COLON';
"."								return 'DOT';
","								return 'COMMA';

"-" 							return 'MINUS';
"+"								return 'PLUS';
"*"								return 'MULT';
"/" 							return 'DIV';

"@"								return 'AT';
"#"								return 'SHARP';

'"'.+'"' 						return 'STRING';
[A-Fa-f0-9]{6}						return 'HEXA';
[0-9]+('.'[0-9]+)? 				return 'NUMBER';

[A-Z][A-Za-z0-9]*				return 'CAP_ID';
[a-z][A-Za-z0-9]* 				return 'MIN_ID';


/lex

/* grammar */

%left PLUS MINUS
%left MULT DIV
%nonassoc UMINUS



%start csso

%%

csso:
	decl EOF 										{ return new NNode.NRoot($1) }
;

decl:
		declClass 	decl 							{ $$ = [$1].concat($2) }						
	|	declImport	decl 							{ $$ = [$1].concat($2) }
	|												{ $$ = [] }
;

/* import */

declImport:
	IMPORT STRING SEMI_COLON						{ $$ = new NNode.NImport($2) }
;

/* class */

declClass:
	CLASS CAP_ID declClassWithExtends
	L_CURLY_BRACKET
		declClassBody
	R_CURLY_BRACKET 								{ $$ = new NNode.NClass($2, $3, $5) }
;

declClassWithExtends:
		EXTENDS CAP_ID								{ $$ = $2 }
	|												{ $$ = undefined }
;

declClassBody:
		declConstant		declClassBody			{ $$ = [$1].concat($2) }
	|	declFunction 		declClassBody			{ $$ = [$1].concat($2) }
	|												{ $$ = [] }
;

/* constant */

declConstant:
	AT MIN_ID DOUBLE_DOT constantValue SEMI_COLON	{ $$ = new NNode.NConstant($2, $4) }
;

constantValue:
		L_PAR calculExpr R_PAR 						{ $$ = $2 }
	|	calculValue
	| 	MINUS calculValue %prec UMINUS				{ $$ = new NNode.NMathMult(new NNode.NNumber(-1, NNode.Unit.None), $2) }
	| 	specialValue
;

specialValue:
		typeColor
	| 	typeString
	| 	typeUrl
	| 	typeCalc
;

/* function */

declFunction:
	declFunctionIsStatic declFunctionName 
	L_PAR 
		declFunctionArgument 
	R_PAR
	declFunctionWithChild
	L_CURLY_BRACKET
		declFunctionBody
	R_CURLY_BRACKET									{ $$ = new NNode.NFunction($2.name, $2.ctor, $4, $6, $8, $1) }
;

declFunctionName:
		MIN_ID										{ $$ = { name: $1, ctor: false } }
	| 	CAP_ID										{ $$ = { name: $1, ctor: true } }
;

declFunctionIsStatic:
		STATIC FUNCTION								{ $$ = true }
	|	FUNCTION									{ $$ = false }
;

declFunctionArgument:
		AT MIN_ID declFunctionMultiArgument 		{ $$ = [$2].concat($3) }
	|												{ $$ = [] }
;

declFunctionMultiArgument:
		COMMA AT MIN_ID declFunctionMultiArgument 	{ $$ = [$3].concat($4) }
	| 												{ $$ = [] }
;

declFunctionWithChild:
		DOUBLE_DOT declChild 							{ $$ = $2 }
	|													{ $$ = [] }
;

declChild:
		STRING 
		ARROW 
		declFunctionChildValue SEMI_COLON
		declChild 									{ $$ = [new NNode.NChild($1, $3)].concat($5) }
	| 												{ $$ = [] }
;

declFunctionChildValue:
		classCall									{ $$ = $1 }
	| 	staticCall									{ $$ = $1 }
	| 	functionCall 								{ $$ = $1 }
;

declFunctionBody:
		callSuper declFunctionBody					{ $$ = [$1].concat($2) }
	| 	declProperty declFunctionBody				{ $$ = [$1].concat($2) }
	| 												{ $$ = [] }
;

/* super */

callSuper:
	SUPER
	L_PAR
		declFunctionArgument
	R_PAR
	SEMI_COLON										{ $$ = new NNode.NSuper($3) }
;

/* property */

declProperty:
	MIN_ID
	DOUBLE_DOT
	declPropertyValueList
	SEMI_COLON 										{ $$ = new NNode.NProperty($1, $3) }
;

declPropertyValueList:
		declPropertyValue declPropertyValueList		{ $$ = [$1].concat($2) }
	|												{ $$ = [] }
;

declPropertyValue:
	 	constantValue								{ $$ = $1}
	| 	MIN_ID 										{ $$ = new NNode.NValue($1) }
;

/* function call */

classCall:
	NEW CAP_ID 
	L_PAR 
		declFunctionArgument 
	R_PAR 											{ $$ = new NNode.NClassCall($2, $4) }									
;

staticCall:
	CAP_ID DOT MIN_ID 
	L_PAR 
		declFunctionArgument 
	R_PAR											{ $$ = new NNode.NStaticCall($1, $3, $5) }
;

functionCall:
	MIN_ID 
	L_PAR 
		declFunctionArgument 
	R_PAR 											{ $$ = new NNode.NFunctionCall($1, $3) }
;

/* types */

typeColor:
	SHARP HEXA	 									{ $$ = new NNode.NColor($2) }
;

typePercent:
	NUMBER PERCENT 									{ $$ = new NNode.NPercent($1) }
;

typePixel:
	NUMBER PIXEL 									{ $$ = new NNode.NPixel($1) }
;

typePoint:
	NUMBER POINTS 									{ $$ = new NNode.NPoint($1) }
;

typeSecond:
	NUMBER SECOND 									{ $$ = new NNode.NSecond($1) }
;

typeEm:
	NUMBER EM 										{ $$ = new NNode.NEm($1) }
;

typeString:
	STRING  										{ $$ = new NNode.NString($1) }
;

typeCentimeter:
	NUMBER CENTIMETER 								{ $$ = new NNode.NCentimeter($1) }
;

typeMillimeter:
	NUMBER MILLIMETER 								{ $$ = new NNode.NMillimeter($1) }
;

typeInch:
	NUMBER INCH 									{ $$ = new NNode.NInch($1) }
;

typeEx:
	NUMBER EX 										{ $$ = new NNode.NEx($1) }
;

typePica:
	NUMBER PICA 									{ $$ = new NNode.NPica($1) }
;

typeUrl:
	URL
	L_PAR
		STRING
	R_PAR											{ $$ = new NNode.NUrl($3) }
;

typeCalc:
	CALC
	L_PAR
		calculExpr
	R_PAR											{ $$ = new NNode.NCalc($3) }
;

value:
	NUMBER 											{ $$ = new NNode.NNumber($1, NNode.Unit.None) }
;

/* calcul */

calculExpr:
		calculExpr PLUS		calculExpr 				{ $$ = new NNode.NMathPlus($1, $3) }
	| 	calculExpr MINUS	calculExpr 				{ $$ = new NNode.NMathMinus($1, $3) }
	| 	calculExpr MULT 	calculExpr 				{ $$ = new NNode.NMathMult($1, $3) }
	| 	calculExpr DIV 		calculExpr 				{ $$ = new NNode.NMathDiv($1, $3) }
	| 	MINUS calculExpr %prec UMINUS				{ $$ = new NNode.NMathMult(new NNode.NNumber(-1, NNode.Unit.None), $2) }
	| 	L_PAR calculExpr R_PAR 						{ $$ = $2 }
	| 	calculValue 								{ $$ = $1 }
	| 	AT MIN_ID 									{ $$ = new NNode.NConstantCall($2) }

;

calculValue:
	 	typePixel
	| 	typePoint
	| 	typeSecond
	| 	typePercent
	| 	typeEm
	| 	typeMillimeter
	| 	typeCentimeter
	| 	typeInch
	| 	typePica
	| 	typeEx
	| 	value
;

