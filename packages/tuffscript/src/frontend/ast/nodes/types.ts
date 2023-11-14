import {
  Expressions,
  PrimitiveExpression,
  FunctionDeclaration,
  AssignmentExpression,
  IfExpression,
  UnaryExpression,
  BinaryExpression,
  CallExpression,
  MemberExpression,
  Identifier,
  NumberLiteral,
  StringLiteral,
  TrueLiteral,
  FalseLiteral,
  NilLiteral,
  Property,
  ObjectLiteral,
} from '../types';

export interface AssignmentExpressionNodeArgs {
  assigne: string;
  value: PrimitiveExpression;
}
export type AssignmentExpressionNode = (
  args: AssignmentExpressionNodeArgs,
) => AssignmentExpression;

export interface IfExpressionsNodeArgs {
  condition: PrimitiveExpression;
  thenBody: Expressions;
  elseBody: Expressions;
}

export type IfExpressionNode = (args: IfExpressionsNodeArgs) => IfExpression;

export interface FunctionDeclarationNodeArgs {
  name: string;
  arguments: string[];
  body: Expressions;
}

export type FunctionDeclarationNode = (
  args: FunctionDeclarationNodeArgs,
) => FunctionDeclaration;

export interface BinaryExpressionNodeArgs {
  left: PrimitiveExpression;
  right: PrimitiveExpression;
  operator: string; // needs to be of type BinaryOperator
}

export type BinaryExpressionNode = (
  args: BinaryExpressionNodeArgs,
) => BinaryExpression;

export interface UnaryExpressionNodeArgs {
  operator: string;
  argument: PrimitiveExpression;
}

export type UnaryExpressionNode = (
  args: UnaryExpressionNodeArgs,
) => UnaryExpression;

export interface CallExpressionNodeArgs {
  arguments: PrimitiveExpression[];
  caller: PrimitiveExpression;
}

export type CallExpressionNode = (
  args: CallExpressionNodeArgs,
) => CallExpression;

export interface MemberExpressionNodeArgs {
  object: PrimitiveExpression;
  property: PrimitiveExpression;
  computed: boolean;
}

export type MemberExpressionNode = (
  args: MemberExpressionNodeArgs,
) => MemberExpression;

export interface IdentifierNodeArgs {
  symbol: string;
}

export type IdentifierNode = (args: IdentifierNodeArgs) => Identifier;

export interface NumberLiteralNodeArgs {
  value: number;
}

export type NumberLiteralNode = (args: NumberLiteralNodeArgs) => NumberLiteral;

export interface StringLiteralNodeArgs {
  value: string;
}

export type StringLiteralNode = (args: StringLiteralNodeArgs) => StringLiteral;

export interface PropertyNodeArgs {
  key: string;
  value?: PrimitiveExpression;
}

export type TrueLiteralNode = () => TrueLiteral;

export type FalseLiteralNode = () => FalseLiteral;

export type NilLiteralNode = () => NilLiteral;

export type PropertyNode = (args: PropertyNodeArgs) => Property;

export interface ObjectLiteralNodeArgs {
  properties: Property[];
}

export type ObjectLiteralNode = (args: ObjectLiteralNodeArgs) => ObjectLiteral;
