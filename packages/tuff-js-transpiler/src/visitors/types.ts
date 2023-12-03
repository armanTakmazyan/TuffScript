import {
  NullLiteral,
  BooleanLiteral,
  StringLiteral,
  NumericLiteral,
  Identifier,
  FunctionDeclaration as JSFunctionDeclaration,
  // AssignmentExpression as JSAssignmentExpression,
  BinaryExpression as JSBinaryExpression,
  CallExpression as JSCallExpression,
  MemberExpression as JSMemberExpression,
  UnaryExpression as JSUnaryExpression,
  LogicalExpression as JSLogicalExpression,
  ObjectExpression,
  IfStatement,
  ExpressionStatement,
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
} from 'tuffscript/ast/types';

export type JSUnaryOperator = JSUnaryExpression['operator'];

export type JSBinaryOperator = JSBinaryExpression['operator'];

export type JSLogicalOperator = JSLogicalExpression['operator'];

export interface TransformFuntionDeclarationArgs {
  astNode: FunctionDeclaration;
}

export type TransformFunctionDeclarationResult = JSFunctionDeclaration;

export interface TransformAssignmentExpressionArgs {
  astNode: AssignmentExpression;
}

// export type TransformAssignmentExpressionResult = JSAssignmentExpression;

export type TransformAssignmentExpressionResult = ExpressionStatement;

export interface TransformIfExpressionArgs {
  astNode: IfExpression;
}

export type TransformIfExpressionResult = IfStatement;

export interface TransformObjectLiteralArgs {
  astNode: ObjectLiteral;
}

export type TransformObjectLiteralResult = ObjectExpression;

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

export interface TransformPrimaryExpressionArgs {
  astNode: PrimaryExpression;
}

export type TransformPrimaryExpressionResult =
  | NullLiteral
  | BooleanLiteral
  | StringLiteral
  | NumericLiteral
  | Identifier;

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
