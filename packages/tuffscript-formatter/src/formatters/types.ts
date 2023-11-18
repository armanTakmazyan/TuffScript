import {
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  Expression,
  Expressions,
  FunctionDeclaration,
  IfExpression,
  MemberExpression,
  ObjectLiteral,
  PrimaryExpression,
  UnaryExpression,
} from 'tuffscript';
import { StringBuilder } from '../stringBuilder';

export interface Formatter {
  indentationLevel: number;
  stringBuilder: StringBuilder;
}

export interface FormBlockArgs extends Formatter {
  block: Expressions;
}

export interface FormatFuntionDeclarationArgs extends Formatter {
  astNode: FunctionDeclaration;
}

export interface FormatAssignmentExpressionArgs extends Formatter {
  astNode: AssignmentExpression;
}

export interface FormatIfExpressionArgs extends Formatter {
  astNode: IfExpression;
}

export interface FormatObjectLiteralArgs extends Formatter {
  astNode: ObjectLiteral;
}

export interface FormatBinaryExpressionArgs extends Formatter {
  astNode: BinaryExpression;
}

export interface FormatUnaryExpressionArgs extends Formatter {
  astNode: UnaryExpression;
}

export interface FormatMemberExpressionArgs extends Formatter {
  astNode: MemberExpression;
}

export interface FormatCallExpressionArgs extends Formatter {
  astNode: CallExpression;
}

export interface FormatPrimaryExpressionArgs extends Formatter {
  astNode: PrimaryExpression;
}

export interface FormatASTArgs {
  astNode: Expression;
  indentationLevel: number;
  stringBuilder: StringBuilder;
}

export type FormatAST = (args: FormatASTArgs) => void;
