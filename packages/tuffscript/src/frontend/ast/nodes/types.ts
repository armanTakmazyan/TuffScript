import { Position } from '../../lexer/token/types';
import { Token } from '../../lexer/token/token';
import {
  Expressions,
  FunctionDeclaration,
  AssignmentExpression,
  IfExpression,
  PrimitiveExpression,
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

export interface FunctionDeclarationNodeArgs {
  name: Identifier;
  arguments: Identifier[];
  body: Expressions;
  position: Position;
}

export type FunctionDeclarationNode = (
  args: FunctionDeclarationNodeArgs,
) => FunctionDeclaration;

export interface AssignmentExpressionNodeArgs {
  assignee: Identifier | MemberExpression;
  value: PrimitiveExpression;
  position: Position;
}

export type AssignmentExpressionNode = (
  args: AssignmentExpressionNodeArgs,
) => AssignmentExpression;

export interface IfExpressionsNodeArgs {
  condition: PrimitiveExpression;
  thenBody: Expressions;
  elseBody: Expressions;
  position: Position;
}

export type IfExpressionNode = (args: IfExpressionsNodeArgs) => IfExpression;

export interface BinaryExpressionNodeArgs {
  left: PrimitiveExpression;
  right: PrimitiveExpression;
  operator: string; // needs to be of type BinaryOperator
  position: Position;
}

export type BinaryExpressionNode = (
  args: BinaryExpressionNodeArgs,
) => BinaryExpression;

export interface UnaryExpressionNodeArgs {
  operator: string;
  argument: PrimitiveExpression;
  position: Position;
}

export type UnaryExpressionNode = (
  args: UnaryExpressionNodeArgs,
) => UnaryExpression;

interface BaseMemberExpressionNodeArgs {
  position: Position;
  object: PrimitiveExpression;
}

interface NonComputedMemberExpressionNodeArgs
  extends BaseMemberExpressionNodeArgs {
  computed: false;
  property: Identifier;
}

interface ComputedMemberExpressionNodeArgs
  extends BaseMemberExpressionNodeArgs {
  computed: true;
  property: PrimitiveExpression;
}

export type MemberExpressionNodeArgs =
  | NonComputedMemberExpressionNodeArgs
  | ComputedMemberExpressionNodeArgs;

export type MemberExpressionNode = (
  args: MemberExpressionNodeArgs,
) => MemberExpression;

export interface CallExpressionNodeArgs {
  arguments: PrimitiveExpression[];
  caller: PrimitiveExpression;
  position: Position;
}

export type CallExpressionNode = (
  args: CallExpressionNodeArgs,
) => CallExpression;

export interface IdentifierNodeArgs {
  token: Token;
}

export type IdentifierNode = (args: IdentifierNodeArgs) => Identifier;

export interface NumberLiteralNodeArgs {
  token: Token;
}

export type NumberLiteralNode = (args: NumberLiteralNodeArgs) => NumberLiteral;

export interface StringLiteralNodeArgs {
  token: Token;
}

export type StringLiteralNode = (args: StringLiteralNodeArgs) => StringLiteral;

export interface TrueLiteralNodeArgs {
  token: Token;
}

export type TrueLiteralNode = (args: TrueLiteralNodeArgs) => TrueLiteral;

export interface FalseLiteralNodeArgs {
  token: Token;
}

export type FalseLiteralNode = (args: FalseLiteralNodeArgs) => FalseLiteral;

export interface NilLiteralNodeArgs {
  token: Token;
}

export type NilLiteralNode = (args: NilLiteralNodeArgs) => NilLiteral;

export interface CreatePropertyArgs {
  token: Token;
  value?: PrimitiveExpression;
}

export type CreateProperty = (args: CreatePropertyArgs) => Property;

export interface ObjectLiteralNodeArgs {
  properties: Property[];
  position: Position;
}

export type ObjectLiteralNode = (args: ObjectLiteralNodeArgs) => ObjectLiteral;
