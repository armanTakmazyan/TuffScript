// import util from 'util';
export { Lexer } from './frontend/lexer';
export { Parser } from './frontend/parser';
export { Interpreter } from './runtime/interpreter';

// import { Lexer } from './frontend/lexer';
// import { Parser } from './frontend/parser';
// import { Interpreter } from './runtime/interpreter';

// const simpleFunction = `
// պահել {բբբ: {աաաա: {աա: 'global arjeq'}}} բ ում
// տպել('tpumenq b-n drsum')
// պահել 'im function-@ pahatsa' իմՖունկցիա ում
// տպել(բ)
//     ֆունկցիա իմՖունկցիա() կատարել
//     տպել(բ)
//         պահել {աաաա: 'some_value'} բ ում
//         տպել('tpumenq b-n nersum')
//         տպել(բ)
//     ավարտել
//     իմՖունկցիա()
//     տպել('tpumenq b-n drsum')
// տպել(բ.բբբ['աաաա'])

// `;

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
