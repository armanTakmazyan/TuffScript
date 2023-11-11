import { TokenType } from './tokenType';
import { TokenKind } from './types';

export const LITERAL_TOKEN_PATTERNS = {
  [TokenKind.Number]: new TokenType({
    name: TokenKind.Number,
    regex: '[0-9]+',
  }),
  [TokenKind.String]: new TokenType({
    name: TokenKind.String,
    regex: "'(?:[^'\\\\]|\\\\.)*'",
  }),
} as const;

export const KEYWORD_TOKEN_PATTERNS = {
  [TokenKind.True]: new TokenType({
    name: TokenKind.True,
    regex: 'ճշմարտություն',
  }),
  [TokenKind.False]: new TokenType({
    name: TokenKind.False,
    regex: 'կեղծիք',
  }),
  [TokenKind.Do]: new TokenType({
    name: TokenKind.Do,
    regex: 'կատարել',
  }),
  [TokenKind.End]: new TokenType({
    name: TokenKind.End,
    regex: 'ավարտել',
  }),
  [TokenKind.Store]: new TokenType({
    name: TokenKind.Store,
    regex: 'պահել',
  }),
  [TokenKind.ContainmentSuffix]: new TokenType({
    name: TokenKind.ContainmentSuffix,
    regex: 'ում',
  }),
  [TokenKind.Function]: new TokenType({
    name: TokenKind.Function,
    regex: 'ֆունկցիա',
  }),
} as const;

// '^[\u0531-\u0556\u0561-\u0587]+$'
export const IDENTIFIER_TOKEN_PATTERNS = {
  [TokenKind.Identifier]: new TokenType({
    name: TokenKind.Identifier,
    regex: '[\u0531-\u0556\u0561-\u0587]+',
  }),
} as const;

// Grouping * Operators
export enum UnaryOperators {
  Not = 'ոչ',
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
}

export const OPERATOR_TOKEN_PATTERNS = {
  [TokenKind.UnaryOperator]: new TokenType({
    name: TokenKind.UnaryOperator,
    regex: 'ոչ',
  }),
  [TokenKind.BinaryOperator]: new TokenType({
    name: TokenKind.BinaryOperator,
    regex: '(\\+|-|\\*|\\/|հավասար է|փոքր է|մեծ է)',
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

/**
 * keywords and known identifiers, symbols.
 */
export const KEYWORDS = [
  TokenKind.True,
  TokenKind.False,
  TokenKind.Do,
  TokenKind.End,
  TokenKind.Store,
  TokenKind.ContainmentSuffix,
  TokenKind.Function,
] as const;
