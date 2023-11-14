// -----------------------------------------------------------
// --------------          AST TYPES        ------------------
// ---     Defines the structure of our languages AST      ---
// -----------------------------------------------------------

import { LiteralValues } from '../lexer/token/constants';

export enum ExpressionNodeType {
  // TOP level expressions
  FunctionDeclaration = 'FunctionDeclaration',
  AssignmentExpression = 'AssignmentExpression',
  IfExpression = 'IfExpression',
  // Other expressions
  MemberExpression = 'MemberExpression',
  CallExpression = 'CallExpression',
  // Literals
  Property = 'Property',
  ObjectLiteral = 'ObjectLiteral',
  NumberLiteral = 'NumberLiteral',
  StringLiteral = 'StringLiteral',
  Identifier = 'Identifier',
  BinaryExpression = 'BinaryExpression',
  UnaryExpression = 'UnaryExpression',
  // Boolean Values
  TrueLiteral = 'TrueLiteral',
  FalseLiteral = 'FalseLiteral',
  // Nil
  NilLiteral = 'NilLiteral',
}

export interface BaseExpression {
  type: ExpressionNodeType;
}

export interface AssignmentExpression extends BaseExpression {
  type: ExpressionNodeType.AssignmentExpression;
  assigne: string;
  value: PrimitiveExpression;
}

export interface IfExpression extends BaseExpression {
  type: ExpressionNodeType.IfExpression;
  condition: PrimitiveExpression;
  thenBody: Expressions;
  elseBody: Expressions;
}

export interface FunctionDeclaration extends BaseExpression {
  type: ExpressionNodeType.FunctionDeclaration;
  arguments: string[];
  name: string;
  body: Expressions;
}

/**
 * A operation with two sides seperated by a operator.
 * Both sides can be ANY Complex Expression.
 * - Supported Operators -> + | - | / | * | %
 */
export interface BinaryExpression extends BaseExpression {
  type: ExpressionNodeType.BinaryExpression;
  left: PrimitiveExpression;
  right: PrimitiveExpression;
  operator: string; // needs to be of type BinaryOperator
}

export interface UnaryExpression extends BaseExpression {
  type: ExpressionNodeType.UnaryExpression;
  operator: string;
  argument: PrimitiveExpression;
}

export interface CallExpression extends BaseExpression {
  type: ExpressionNodeType.CallExpression;
  arguments: PrimitiveExpression[];
  caller: PrimitiveExpression;
}

export interface MemberExpression extends BaseExpression {
  type: ExpressionNodeType.MemberExpression;
  object: PrimitiveExpression;
  property: PrimitiveExpression;
  computed: boolean;
}

// LITERAL / PRIMARY EXPRESSION TYPES
/**
 * Represents a user-defined variable or symbol in source.
 */
export interface Identifier extends BaseExpression {
  type: ExpressionNodeType.Identifier;
  symbol: string;
}

/**
 * Represents a numeric constant inside the soure code.
 */
export interface NumberLiteral extends BaseExpression {
  type: ExpressionNodeType.NumberLiteral;
  value: number;
}

export interface StringLiteral extends BaseExpression {
  type: ExpressionNodeType.StringLiteral;
  value: string;
}

export interface TrueLiteral extends BaseExpression {
  type: ExpressionNodeType.TrueLiteral;
  value: LiteralValues.True;
}

export interface FalseLiteral extends BaseExpression {
  type: ExpressionNodeType.FalseLiteral;
  value: LiteralValues.False;
}

export interface NilLiteral extends BaseExpression {
  type: ExpressionNodeType.NilLiteral;
  value: LiteralValues.Nil;
}

export interface Property extends BaseExpression {
  type: ExpressionNodeType.Property;
  key: string;
  value?: PrimitiveExpression;
}

export interface ObjectLiteral extends BaseExpression {
  type: ExpressionNodeType.ObjectLiteral;
  properties: Property[];
}

export type PrimitiveExpression =
  | MemberExpression
  | CallExpression
  | ObjectLiteral
  | NumberLiteral
  | StringLiteral
  | TrueLiteral
  | FalseLiteral
  | NilLiteral
  | Identifier
  | UnaryExpression
  | BinaryExpression;

export type Expression =
  | FunctionDeclaration
  | AssignmentExpression
  | IfExpression
  | PrimitiveExpression;

export type Expressions = Expression[];

export interface Program {
  type: 'Program';
  body: Expressions;
}
