import { TokenType } from './tokenType';
import { TokenKind } from './types';

export enum LiteralValues {
  True = 'ճշմարտություն',
  False = 'կեղծիք',
  Nil = 'սահմանված չէ',
}

export const LITERAL_TOKEN_PATTERNS = {
  [TokenKind.Number]: new TokenType({
    name: TokenKind.Number,
    regex: '\\d+(\\.\\d+)?',
  }),
  [TokenKind.String]: new TokenType({
    name: TokenKind.String,
    regex: "'(?:[^'\\\\]|\\\\.)*'",
  }),
  [TokenKind.True]: new TokenType({
    name: TokenKind.True,
    regex: LiteralValues.True,
  }),
  [TokenKind.False]: new TokenType({
    name: TokenKind.False,
    regex: LiteralValues.False,
  }),
  [TokenKind.Nil]: new TokenType({
    name: TokenKind.Nil,
    regex: LiteralValues.Nil,
  }),
} as const;

// '^[\u0531-\u0556\u0561-\u0587]+$'
export const IDENTIFIER_TOKEN_PATTERNS = {
  [TokenKind.Identifier]: new TokenType({
    name: TokenKind.Identifier,
    regex: '[\u0531-\u0556\u0561-\u0587]+',
  }),
} as const;

export enum KeywordValues {
  Do = 'կատարել',
  End = 'ավարտել',
  Store = 'պահել',
  ContainmentSuffix = 'ում',
  If = 'եթե',
  Else = 'հակառակ դեպքում',
  Function = 'ֆունկցիա',
}

export const KEYWORD_TOKEN_PATTERNS = {
  [TokenKind.Do]: new TokenType({
    name: TokenKind.Do,
    regex: KeywordValues.Do,
  }),
  [TokenKind.End]: new TokenType({
    name: TokenKind.End,
    regex: KeywordValues.End,
  }),
  [TokenKind.Store]: new TokenType({
    name: TokenKind.Store,
    regex: KeywordValues.Store,
  }),
  [TokenKind.ContainmentSuffix]: new TokenType({
    name: TokenKind.ContainmentSuffix,
    regex: KeywordValues.ContainmentSuffix,
  }),
  [TokenKind.If]: new TokenType({
    name: TokenKind.If,
    regex: KeywordValues.If,
  }),
  [TokenKind.Else]: new TokenType({
    name: TokenKind.Else,
    regex: KeywordValues.Else,
  }),
  [TokenKind.Function]: new TokenType({
    name: TokenKind.Function,
    regex: KeywordValues.Function,
  }),
} as const;

// Grouping * Operators
export enum UnaryOperators {
  Not = 'ոչ',
  Minus = '-',
}

export enum BinaryOperators {
  ADDITION = '+',
  SUBTRACTION = '-',
  MULTIPLICATION = '*',
  DIVISION = '/',
  MODULUS = '%',
  EQUALS = 'հավասար է',
  LESS_THAN = 'փոքր է',
  GREATER_THAN = 'մեծ է',
  AND = 'և',
  OR = 'կամ',
}

export const OPERATOR_TOKEN_PATTERNS = {
  [TokenKind.UnaryOperator]: new TokenType({
    name: TokenKind.UnaryOperator,
    regex: 'ոչ',
  }),
  [TokenKind.BinaryOperator]: new TokenType({
    name: TokenKind.BinaryOperator,
    regex: '(\\+|-|\\*|\\/|հավասար է|փոքր է|մեծ է|և|կամ)',
  }),
};

export const PUNCTUATION_TOKEN_PATTERNS = {
  [TokenKind.Newline]: new TokenType({
    name: TokenKind.Newline,
    regex: '[\\n]+',
  }),
  [TokenKind.Space]: new TokenType({
    name: TokenKind.Space,
    regex: '[ \\t\\r]',
  }),
  [TokenKind.Comma]: new TokenType({
    name: TokenKind.Comma,
    regex: ',',
  }),
  [TokenKind.Dot]: new TokenType({
    name: TokenKind.Dot,
    regex: '\\.',
  }),
  [TokenKind.Colon]: new TokenType({
    name: TokenKind.Colon,
    regex: ':',
  }),
  [TokenKind.Semicolon]: new TokenType({
    name: TokenKind.Semicolon,
    regex: ';',
  }),
  [TokenKind.OpenParen]: new TokenType({
    name: TokenKind.OpenParen,
    regex: '\\(',
  }),
  [TokenKind.CloseParen]: new TokenType({
    name: TokenKind.CloseParen,
    regex: '\\)',
  }),
  [TokenKind.OpenBrace]: new TokenType({
    name: TokenKind.OpenBrace,
    regex: '\\{',
  }),
  [TokenKind.CloseBrace]: new TokenType({
    name: TokenKind.CloseBrace,
    regex: '\\}',
  }),
  [TokenKind.OpenBracket]: new TokenType({
    name: TokenKind.OpenBracket,
    regex: '\\[',
  }),
  [TokenKind.CloseBracket]: new TokenType({
    name: TokenKind.CloseBracket,
    regex: '\\]',
  }),
  [TokenKind.EOF]: new TokenType({
    name: TokenKind.EOF,
    regex: '',
  }),
};

export const TOKEN_PATTERNS_LIST = [
  ...Object.values(LITERAL_TOKEN_PATTERNS),
  ...Object.values(KEYWORD_TOKEN_PATTERNS),
  ...Object.values(OPERATOR_TOKEN_PATTERNS),
  ...Object.values(IDENTIFIER_TOKEN_PATTERNS),
  ...Object.values(PUNCTUATION_TOKEN_PATTERNS),
] as const;

// keywords and known identifiers, symbols
export const KEYWORDS = [
  TokenKind.Do,
  TokenKind.End,
  TokenKind.Store,
  TokenKind.ContainmentSuffix,
  TokenKind.Function,
  TokenKind.If,
  TokenKind.Else,
  TokenKind.And,
  TokenKind.Or,
] as const;
