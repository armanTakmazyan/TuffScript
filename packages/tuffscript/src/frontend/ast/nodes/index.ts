import { LiteralValues } from '../../lexer/token/constants';
import { StatementNodeType, ExpressionNodeType } from '../types';
import {
  AssignmentNode,
  IfStatementNode,
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
  NilLiteralNode,
} from './types';

// Statements
export const assignmentNode: AssignmentNode = ({ ...rest }) => ({
  type: StatementNodeType.Assignment,
  ...rest,
});

export const ifStatementNode: IfStatementNode = ({ ...rest }) => ({
  type: StatementNodeType.IfStatement,
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

export const trueLiteralNode: TrueLiteralNode = () => ({
  type: ExpressionNodeType.TrueLiteral,
  value: LiteralValues.True,
});

export const falseLiteralNode: FalseLiteralNode = () => ({
  type: ExpressionNodeType.FalseLiteral,
  value: LiteralValues.False,
});

export const nilLiteralNode: NilLiteralNode = () => ({
  type: ExpressionNodeType.NilLiteral,
  value: LiteralValues.Nil,
});

export const propertyNode: PropertyNode = ({ ...rest }) => ({
  type: ExpressionNodeType.Property,
  ...rest,
});

export const objectLiteralNode: ObjectLiteralNode = ({ ...rest }) => ({
  type: ExpressionNodeType.ObjectLiteral,
  ...rest,
});
