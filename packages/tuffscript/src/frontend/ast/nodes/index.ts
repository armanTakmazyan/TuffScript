import { StatementNodeType, ExpressionNodeType } from '../types';
import {
  AssignmentNode,
  FunctionDeclarationNode,
  UnaryExpressionNode,
  BinaryExpressionNode,
  CallExpressionNode,
  MemberExpressionNode,
  IdentifierNode,
  NumberLiteralNode,
  PropertyNode,
  ObjectLiteralNode,
  StringLiteralNode,
  TrueLiteralNode,
  FalseLiteralNode,
} from './types';

// Statements
export const assignmentNode: AssignmentNode = ({ ...rest }) => ({
  type: StatementNodeType.Assignment,
  ...rest,
});

export const functionDeclarationNode: FunctionDeclarationNode = ({
  ...rest
}) => ({
  type: StatementNodeType.FunctionDeclaration,
  ...rest,
});

// Expressions
export const binaryExpressionNode: BinaryExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.BinaryExpression,
  ...rest,
});

export const unaryExpressionNode: UnaryExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.UnaryExpression,
  ...rest,
});

export const callExpressionNode: CallExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.CallExpression,
  ...rest,
});

export const memberExpressionNode: MemberExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.MemberExpression,
  ...rest,
});

export const identifierNode: IdentifierNode = ({ ...rest }) => ({
  type: ExpressionNodeType.Identifier,
  ...rest,
});

export const numberLiteralNode: NumberLiteralNode = ({ ...rest }) => ({
  type: ExpressionNodeType.NumberLiteral,
  ...rest,
});

export const stringLiteralNode: StringLiteralNode = ({ ...rest }) => ({
  type: ExpressionNodeType.StringLiteral,
  ...rest,
});

export const trueLiteralNode: TrueLiteralNode = ({ ...rest }) => ({
  type: ExpressionNodeType.TrueLiteral,
  ...rest,
});

export const falseLiteralNode: FalseLiteralNode = ({ ...rest }) => ({
  type: ExpressionNodeType.FalseLiteral,
  ...rest,
});

export const propertyNode: PropertyNode = ({ ...rest }) => ({
  type: ExpressionNodeType.Property,
  ...rest,
});

export const objectLiteralNode: ObjectLiteralNode = ({ ...rest }) => ({
  type: ExpressionNodeType.ObjectLiteral,
  ...rest,
});
