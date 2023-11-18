import util from 'util';
import { Lexer } from './frontend/lexer';
import { Parser } from './frontend/parser';
import { Interpreter } from './runtime/interpreter';

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
         
        

        ֆունկցիա արտե() կատարել
          եթե 7 փոքր է 3  փոքր է 3  փոքր է 3 կատարել
            պահել 3 փոփոփոել ում
          հակառակ դեպքում 
            եթե 7 փոքր է 3 կամ 7 հավասար է 7 և 4 կատարել
            պահել 3 փոփոփոել ում
            հակառակ դեպքում 
            փոփոփոել()
          ավարտել
          
          ավարտել
        ավարտել

        արտե

    ավարտել
`;

const simpleAriphmetic = `
պահել 9 խարխար ում
պահել -5 խարխարումում ում
խարխար - խարխարումում
`;

const simpleFunction = `
ֆունկցիա անուննն(ան)
կատարել
  եթե սահմանված չէ կատարել
  3
  հակառակ դեպքում 
  4
  ավարտել
  34 մեծ է 32
  ֆունկցիա անուուննն() կատարել
  պահել 'tpeluya' փոփփփփփփփոփոել ում
    ֆունկցիա աաաաանուուննն() կատարել
    փոփփփփփփփոփոել
    ավարտել 
  
  ավարտել
  անուուննն()
ավարտել

պահել անուննն(6,3) փոփոփոփոել ում
փոփոփոփոել()
պահել {ել: {պա: {լ: 4}}} պահեհհհլ ում
պահեհհհլ.ել['պա'].լ
`;

const lexer = new Lexer(simpleAriphmetic);

const tokens = lexer.lexAnalysis();
// console.log(tokens);

const parser = new Parser({ tokens });
const astTree = parser.produceAST();
console.log(
  util.inspect(astTree, { showHidden: false, depth: null, colors: true }),
);

const interpreter = new Interpreter({ program: astTree });
console.log(interpreter.evaluate());
