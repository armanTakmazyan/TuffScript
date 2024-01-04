import {
  ASTNodeVisitor,
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  Expressions,
  FunctionDeclaration,
  IfExpression,
  MemberExpression,
  ObjectLiteral,
  PrimaryExpression,
  UnaryExpression,
} from 'tuffscript/ast/types';
import { StringBuilder } from '../stringBuilder';

export interface FormatterVisitorConstructorArgs {
  indentationLevel: number;
  stringBuilder: StringBuilder;
}

export interface FormatBlockArgs {
  block: Expressions;
  lineEnding?: string;
}

export interface FormatterVisitor extends ASTNodeVisitor {
  indentationLevel: number;
  stringBuilder: StringBuilder;
  formatBlock: (args: FormatBlockArgs) => void;
  withIncreasedIndentation(callback: () => void): void;
}

export interface FormatFuntionDeclarationArgs {
  astNode: FunctionDeclaration;
}

export interface FormatAssignmentExpressionArgs {
  astNode: AssignmentExpression;
}

export interface FormatIfExpressionArgs {
  astNode: IfExpression;
}

export interface FormatObjectLiteralArgs {
  astNode: ObjectLiteral;
}

export interface FormatBinaryExpressionArgs {
  astNode: BinaryExpression;
}

export interface FormatUnaryExpressionArgs {
  astNode: UnaryExpression;
}

export interface FormatMemberExpressionArgs {
  astNode: MemberExpression;
}

export interface FormatCallExpressionArgs {
  astNode: CallExpression;
}

export interface FormatPrimaryExpressionArgs {
  astNode: PrimaryExpression;
}
