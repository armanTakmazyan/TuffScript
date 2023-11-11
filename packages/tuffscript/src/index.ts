import util from 'util';
import { Lexer } from './frontend/lexer';
import { Parser } from './frontend/parser';

const tuffCode = `
ֆունկցիա անուն()
    կատարել
        տպել('Բարև Աշխարհ')
        տպել(123123)
        23 + 2
        տպե.եետ
        պահել Աշխ Աշխարհ ում
         
    ավարտել
`;

const simpleAriphmetic = `
միավոր
2



   
            ավ 
    
      5
   
`;

const lexer = new Lexer(tuffCode);

const tokens = lexer.lexAnalysis();
// console.log(tokens);

const parser = new Parser({ tokens });
const astTree = parser.produceAST();
console.log(
  util.inspect(astTree, { showHidden: false, depth: null, colors: true }),
);
