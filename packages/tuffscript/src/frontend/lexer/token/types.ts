import { KEYWORDS } from './constants';

export enum TokenKind {
  // Literal Types
  Number = 'Number',
  String = 'String',
  Identifier = 'Identifier',
  True = 'True',
  False = 'False',
  Nil = 'Nil',
  // Keywords
  Do = 'Do',
  End = 'End',
  Function = 'Function',
  Store = 'Store',
  ContainmentSuffix = 'ContainmentSuffix',
  If = 'If',
  Else = 'Else',
  And = 'And',
  Or = 'Or',
  // Grouping * Operators
  UnaryOperator = 'UnaryOperator',
  BinaryOperator = 'BinaryOperator',
  Space = 'Space',
  Newline = 'Newline',
  Comma = 'Comma',
  Dot = 'Dot',
  Colon = 'Colon',
  Semicolon = 'Semicolon',
  OpenParen = 'OpenParen', // (
  CloseParen = 'CloseParen', // )
  OpenBrace = 'OpenBrace', // {
  CloseBrace = 'CloseBrace', // }
  OpenBracket = 'OpenBracket', // [
  CloseBracket = 'CloseBracket', //]
  EOF = 'EOF', // Signified the end of file
}

export type Keyword = (typeof KEYWORDS)[number];
