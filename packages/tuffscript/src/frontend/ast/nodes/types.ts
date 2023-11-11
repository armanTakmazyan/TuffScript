import {
  Expression,
  Assignment,
  FunctionDeclaration,
  BinaryExpression,
  CallExpression,
  MemberExpression,
  Identifier,
  NumberLiteral,
  StringLiteral,
  Property,
  ObjectLiteral,
  StatementOrExpression,
} from '../types';

export interface AssignmentNodeArgs {
  assigne: string;
  value: Expression;
}
export type AssignmentNode = (args: AssignmentNodeArgs) => Assignment;

export interface FunctionDeclarationNodeArgs {
  arguments: string[];
  name: string;
  body: StatementOrExpression[];
}

export type FunctionDeclarationNode = (
  args: FunctionDeclarationNodeArgs,
) => FunctionDeclaration;

export interface BinaryExpressionNodeArgs {
  left: Expression;
  right: Expression;
  operator: string; // needs to be of type BinaryOperator
}

export type BinaryExpressionNode = (
  args: BinaryExpressionNodeArgs,
) => BinaryExpression;

export interface CallExpressionNodeArgs {
  args: Expression[];
  caller: Expression;
}

export type CallExpressionNode = (
  args: CallExpressionNodeArgs,
) => CallExpression;

export interface MemberExpressionNodeArgs {
  object: Expression;
  property: Expression;
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
  value?: Expression;
}

export type PropertyNode = (args: PropertyNodeArgs) => Property;

export interface ObjectLiteralNodeArgs {
  properties: Property[];
}

export type ObjectLiteralNode = (args: ObjectLiteralNodeArgs) => ObjectLiteral;
