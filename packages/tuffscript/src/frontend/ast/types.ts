// -----------------------------------------------------------
// --------------          AST TYPES        ------------------
// ---     Defines the structure of our languages AST      ---
// -----------------------------------------------------------

import { LiteralValues } from '../lexer/token/constants';
import { Position } from '../lexer/token/types';

export enum ExpressionNodeType {
  // High-level, complex expressions
  FunctionDeclaration = 'FunctionDeclaration',
  AssignmentExpression = 'AssignmentExpression',
  IfExpression = 'IfExpression',
  // Primitive expressions
  ObjectLiteral = 'ObjectLiteral',
  BinaryExpression = 'BinaryExpression',
  UnaryExpression = 'UnaryExpression',
  MemberExpression = 'MemberExpression',
  CallExpression = 'CallExpression',
  // Primary Expressions
  NumberLiteral = 'NumberLiteral',
  StringLiteral = 'StringLiteral',
  Identifier = 'Identifier',
  // Boolean Values
  TrueLiteral = 'TrueLiteral',
  FalseLiteral = 'FalseLiteral',
  // Nil
  NilLiteral = 'NilLiteral',
}

export interface BaseExpression {
  type: ExpressionNodeType;
  position: Position;
  accept(visitor: ASTNodeVisitor): void;
}

// HIGH-LEVEL/COMPLEX EXPRESSIONS
export interface FunctionDeclaration extends BaseExpression {
  type: ExpressionNodeType.FunctionDeclaration;
  arguments: Identifier[];
  name: Identifier;
  body: Expressions;
}

export interface AssignmentExpression extends BaseExpression {
  type: ExpressionNodeType.AssignmentExpression;
  assignee: Identifier | MemberExpression;
  value: PrimitiveExpression;
}

export interface IfExpression extends BaseExpression {
  type: ExpressionNodeType.IfExpression;
  condition: PrimitiveExpression;
  thenBody: Expressions;
  elseBody: Expressions;
}

// PRIMITIVE EXPRESSIONS
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

export interface MemberExpression extends BaseExpression {
  type: ExpressionNodeType.MemberExpression;
  object: PrimitiveExpression;
  property: PrimitiveExpression;
}

export interface CallExpression extends BaseExpression {
  type: ExpressionNodeType.CallExpression;
  arguments: PrimitiveExpression[];
  caller: PrimitiveExpression;
}

// LITERAL / PRIMARY EXPRESSION TYPES
export interface Identifier extends BaseExpression {
  type: ExpressionNodeType.Identifier;
  symbol: string;
}

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

export interface Property {
  type: 'Property';
  key: string;
  position: Position;
  value?: PrimitiveExpression;
}

export interface ObjectLiteral extends BaseExpression {
  type: ExpressionNodeType.ObjectLiteral;
  properties: Property[];
}

export type PrimaryExpression =
  | Identifier
  | NumberLiteral
  | StringLiteral
  | TrueLiteral
  | FalseLiteral
  | NilLiteral;

export type PrimitiveExpression =
  | ObjectLiteral
  | BinaryExpression
  | UnaryExpression
  | MemberExpression
  | CallExpression
  | PrimaryExpression;

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
export interface ASTNodeVisitor {
  visitFunctionDeclaration(node: FunctionDeclaration): void;
  visitAssignmentExpression(node: AssignmentExpression): void;
  visitIfExpression(node: IfExpression): void;
  visitObjectLiteral(node: ObjectLiteral): void;
  visitBinaryExpression(node: BinaryExpression): void;
  visitUnaryExpression(node: UnaryExpression): void;
  visitMemberExpression(node: MemberExpression): void;
  visitCallExpression(node: CallExpression): void;
  visitIdentifier(node: Identifier): void;
  visitNumberLiteral(node: NumberLiteral): void;
  visitStringLiteral(node: StringLiteral): void;
  visitTrueLiteral(node: TrueLiteral): void;
  visitFalseLiteral(node: FalseLiteral): void;
  visitNilLiteral(node: NilLiteral): void;
}
