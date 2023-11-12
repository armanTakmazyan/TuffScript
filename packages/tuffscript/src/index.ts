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
        պահել սահմանված չէ խարխար ում
        պահել 3 հավասար է 4 հավասար է 7 Աշխարհեետ ում
        3 հավասար է կեղծիք
        4 հավասար է ճշմարտություն
        7 փոքր է 3
        9 մեծ է 3
         
        եթե 7 փոքր է 3 կատարել
          պահել 3 փոփոփոել ում
          հակառակ դեպքում 
          եթե 7 փոքր է 3 կատարել
          պահել 3 փոփոփոել ում
          հակառակ դեպքում 
          փոփոփոել()
          ավարտել
          
        ավարտել

    ավարտել
`;

const simpleAriphmetic = `
9 մեծ է 3
պահել սահմանված չէ խարխար ում
   
`;

const lexer = new Lexer(tuffCode);

const tokens = lexer.lexAnalysis();
console.log(tokens);

const parser = new Parser({ tokens });
const astTree = parser.produceAST();
console.log(
  util.inspect(astTree, { showHidden: false, depth: null, colors: true }),
);
