import { Lexer } from './frontend/lexer';

const tuffCode = `
ֆունկցիա անուն()
    կատարել
        տպել 'Բարև Աշխարհ'
        տպել 123123
        23 + 2
        տպե.եետ
    ավարտել
`;

const lexer = new Lexer(tuffCode);

const tokens = lexer.lexAnalysis();
console.log(tokens);
