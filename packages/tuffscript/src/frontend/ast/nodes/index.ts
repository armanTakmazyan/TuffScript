import { LiteralValues } from '../../lexer/token/constants';
import { ExpressionNodeType } from '../types';
import {
  FunctionDeclarationNode,
  AssignmentExpressionNode,
  IfExpressionNode,
  UnaryExpressionNode,
  BinaryExpressionNode,
  CallExpressionNode,
  MemberExpressionNode,
  IdentifierNode,
  NumberLiteralNode,
  CreateProperty,
  ObjectLiteralNode,
  StringLiteralNode,
  TrueLiteralNode,
  FalseLiteralNode,
  NilLiteralNode,
} from './types';

export const functionDeclarationNode: FunctionDeclarationNode = ({
  ...rest
}) => ({
  type: ExpressionNodeType.FunctionDeclaration,
  accept(visitor) {
    visitor.visitFunctionDeclaration(this);
  },
  ...rest,
});

export const assignmentExpressionNode: AssignmentExpressionNode = ({
  ...rest
}) => ({
  type: ExpressionNodeType.AssignmentExpression,
  accept(visitor) {
    visitor.visitAssignmentExpression(this);
  },
  ...rest,
});

export const ifExpressionNode: IfExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.IfExpression,
  accept(visitor) {
    visitor.visitIfExpression(this);
  },
  ...rest,
});

export const binaryExpressionNode: BinaryExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.BinaryExpression,
  accept(visitor) {
    visitor.visitBinaryExpression(this);
  },
  ...rest,
});

export const unaryExpressionNode: UnaryExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.UnaryExpression,
  accept(visitor) {
    visitor.visitUnaryExpression(this);
  },
  ...rest,
});

export const memberExpressionNode: MemberExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.MemberExpression,
  accept(visitor) {
    visitor.visitMemberExpression(this);
  },
  ...rest,
});

export const callExpressionNode: CallExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.CallExpression,
  accept(visitor) {
    visitor.visitCallExpression(this);
  },
  ...rest,
});

export const identifierNode: IdentifierNode = ({ token }) => ({
  type: ExpressionNodeType.Identifier,
  symbol: token.value,
  position: token.position,
  accept(visitor) {
    visitor.visitIdentifier(this);
  },
});

export const numberLiteralNode: NumberLiteralNode = ({ token }) => ({
  type: ExpressionNodeType.NumberLiteral,
  value: parseFloat(token.value),
  position: token.position,
  accept(visitor) {
    visitor.visitNumberLiteral(this);
  },
});

export const stringLiteralNode: StringLiteralNode = ({ token }) => ({
  type: ExpressionNodeType.StringLiteral,
  value: token.value,
  position: token.position,
  accept(visitor) {
    visitor.visitStringLiteral(this);
  },
});

export const trueLiteralNode: TrueLiteralNode = ({ token }) => ({
  type: ExpressionNodeType.TrueLiteral,
  value: LiteralValues.True,
  position: token.position,
  accept(visitor) {
    visitor.visitTrueLiteral(this);
  },
});

export const falseLiteralNode: FalseLiteralNode = ({ token }) => ({
  type: ExpressionNodeType.FalseLiteral,
  value: LiteralValues.False,
  position: token.position,
  accept(visitor) {
    visitor.visitFalseLiteral(this);
  },
});

export const nilLiteralNode: NilLiteralNode = ({ token }) => ({
  type: ExpressionNodeType.NilLiteral,
  value: LiteralValues.Nil,
  position: token.position,
  accept(visitor) {
    visitor.visitNilLiteral(this);
  },
});

export const createProperty: CreateProperty = ({ token, value }) => ({
  type: 'Property',
  key: token.value,
  position: token.position,
  value,
});

export const objectLiteralNode: ObjectLiteralNode = ({ ...rest }) => ({
  type: ExpressionNodeType.ObjectLiteral,
  accept(visitor) {
    visitor.visitObjectLiteral(this);
  },
  ...rest,
});
