import {
  Expressions,
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

export interface RegisterVariablesFromExpressionsArgs {
  expressions: Expressions;
}

export interface AnalyzeFuntionDeclarationArgs {
  astNode: FunctionDeclaration;
}

export interface AnalyzeAssignmentExpressionArgs {
  astNode: AssignmentExpression;
}

export interface AnalyzeIfExpressionArgs {
  astNode: IfExpression;
}

export interface AnalyzeObjectLiteralArgs {
  astNode: ObjectLiteral;
}

export interface AnalyzeBinaryExpressionArgs {
  astNode: BinaryExpression;
}

export interface AnalyzeUnaryExpressionArgs {
  astNode: UnaryExpression;
}

export interface AnalyzeMemberExpressionArgs {
  astNode: MemberExpression;
}

export interface AnalyzeCallExpressionArgs {
  astNode: CallExpression;
}

export interface AnalyzePrimaryExpressionArgs {
  astNode: PrimaryExpression;
}
