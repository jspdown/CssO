
NAME		= csso

NODE 		= node
JISON 		= jison
TSC 		= tsc
RM			= rm -f

SOURCES 	= ./sources
BIN			= ./bin
TMP			= ./sources/tmp
TEST		= ./test

TEST_SRC 	= $(TEST)/basic.csso


all: $(NAME)

re: clean all grammar
	@(tree)

grammar:
	@(echo '#compiling $(SOURCES)/grammar.jison')
	@($(JISON) -o $(BIN)/grammar.js $(SOURCES)/grammar.jison)

unit: 
	@(echo '#test mode')
	$(foreach file, $(TEST_SRC), $(NODE) $(BIN)/$(NAME).js $(file))

$(NAME):	$(BIN)/nodes.js \
			$(BIN)/csso.js


$(BIN)/nodes.js: $(SOURCES)/nodes.ts
	@(echo '#compiling $(SOURCES)/nodes.ts')
	@($(TSC) --target ES5 --out $(TMP)/nodes.js $(SOURCES)/nodes.ts)
	@(tr -d '\r' < $(TMP)/nodes.js > $(BIN)/nodes.js)

$(BIN)/csso.js: $(SOURCES)/csso.ts
	@(echo '#compiling $(SOURCES)/csso.ts')
	@($(TSC) --target ES5 --out $(TMP)/csso.js $(SOURCES)/csso.ts)
	@(tr -d '\r' < $(TMP)/csso.js > $(BIN)/csso.js)


clean:
	$(RM) $(TMP)/*
	$(RM) $(BIN)/*
