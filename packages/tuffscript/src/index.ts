export { Lexer } from './frontend/lexer';
export { Parser } from './frontend/parser';
export { Interpreter } from './runtime/interpreter';

// const lexer = new Lexer(simpleFunction);

// const tokens = lexer.lexAnalysis();
// console.log(tokens);

// const parser = new Parser({ tokens });
// const astTree = parser.produceAST();
// console.log(
//   util.inspect(astTree, { showHidden: false, depth: null, colors: true }),
// );

// const interpreter = new Interpreter({ program: astTree });
// console.log(interpreter.evaluate());
