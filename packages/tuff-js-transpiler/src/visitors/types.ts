import {
  NullLiteral as JSNullLiteral,
  BooleanLiteral as JSBooleanLiteral,
  StringLiteral as JSStringLiteral,
  NumericLiteral as JSNumericLiteral,
  Identifier as JSIdentifier,
  FunctionDeclaration as JSFunctionDeclaration,
  VariableDeclaration as JSVariableDeclaration,
  ExpressionStatement as JSExpressionStatement,
  IfStatement as JSIfStatement,
  BinaryExpression as JSBinaryExpression,
  CallExpression as JSCallExpression,
  MemberExpression as JSMemberExpression,
  ObjectExpression as JSObjectExpression,
  UnaryExpression as JSUnaryExpression,
  LogicalExpression as JSLogicalExpression,
} from '@babel/types';
import {
  FunctionDeclaration,
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  IfExpression,
  MemberExpression,
  ObjectLiteral,
  PrimaryExpression,
  UnaryExpression,
  Identifier,
} from 'tuffscript/ast/types';

export type JSUnaryOperator = JSUnaryExpression['operator'];

export type JSBinaryOperator = JSBinaryExpression['operator'];

export type JSLogicalOperator = JSLogicalExpression['operator'];

export interface TransformFuntionDeclarationArgs {
  astNode: FunctionDeclaration;
}

export type TransformFunctionDeclarationResult = JSFunctionDeclaration;

export type CreateAssignmentExpressionResult = JSExpressionStatement;

export interface IdentifierAssignment
  extends Omit<AssignmentExpression, 'assignee'> {
  assignee: Identifier;
}

export interface TransformVariableDeclarationArgs {
  astNode: IdentifierAssignment;
}

export type TransformVariableDeclarationResult = JSVariableDeclaration;

export interface TransformAssignmentExpressionArgs {
  astNode: AssignmentExpression;
}

export type TransformAssignmentExpressionResult =
  | JSExpressionStatement
  | JSVariableDeclaration;

export interface TransformIfExpressionArgs {
  astNode: IfExpression;
}

export type TransformIfExpressionResult = JSIfStatement;

export interface TransformObjectLiteralArgs {
  astNode: ObjectLiteral;
}

export type TransformObjectLiteralResult = JSObjectExpression;

export interface TransformBinaryExpressionArgs {
  astNode: BinaryExpression;
}

export type TransformBinaryExpressionResult =
  | JSBinaryExpression
  | JSLogicalExpression;

export interface TransformUnaryExpressionArgs {
  astNode: UnaryExpression;
}

export type TransformUnaryExpressionResult = JSUnaryExpression;

export interface TransformMemberExpressionArgs {
  astNode: MemberExpression;
}

export type TransformMemberExpressionResult = JSMemberExpression;

export interface TransformCallExpressionArgs {
  astNode: CallExpression;
}

export type TransformCallExpressionResult = JSCallExpression;

export interface TransformIdentifierArgs {
  astNode: Identifier;
}

export type TransformIdentifierResult =
  | JSIdentifier
  | TransformMemberExpressionResult;

export type TransformIdentifier = (
  args: TransformIdentifierArgs,
) => TransformIdentifierResult;

export interface TransformPrimaryExpressionArgs {
  astNode: PrimaryExpression;
}

export type TransformPrimaryExpressionResult =
  | JSNullLiteral
  | JSBooleanLiteral
  | JSStringLiteral
  | JSNumericLiteral
  | TransformIdentifierResult;

export type TransformResult =
  | TransformFunctionDeclarationResult
  | TransformAssignmentExpressionResult
  | TransformIfExpressionResult
  | TransformObjectLiteralResult
  | TransformBinaryExpressionResult
  | TransformUnaryExpressionResult
  | TransformMemberExpressionResult
  | TransformCallExpressionResult
  | TransformPrimaryExpressionResult;
