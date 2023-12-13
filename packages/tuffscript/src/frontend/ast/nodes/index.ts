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
    return visitor.visitFunctionDeclaration(this);
  },
  ...rest,
});

export const assignmentExpressionNode: AssignmentExpressionNode = ({
  ...rest
}) => ({
  type: ExpressionNodeType.AssignmentExpression,
  accept(visitor) {
    return visitor.visitAssignmentExpression(this);
  },
  ...rest,
});

export const ifExpressionNode: IfExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.IfExpression,
  accept(visitor) {
    return visitor.visitIfExpression(this);
  },
  ...rest,
});

export const binaryExpressionNode: BinaryExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.BinaryExpression,
  accept(visitor) {
    return visitor.visitBinaryExpression(this);
  },
  ...rest,
});

export const unaryExpressionNode: UnaryExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.UnaryExpression,
  accept(visitor) {
    return visitor.visitUnaryExpression(this);
  },
  ...rest,
});

export const memberExpressionNode: MemberExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.MemberExpression,
  accept(visitor) {
    return visitor.visitMemberExpression(this);
  },
  ...rest,
});

export const callExpressionNode: CallExpressionNode = ({ ...rest }) => ({
  type: ExpressionNodeType.CallExpression,
  accept(visitor) {
    return visitor.visitCallExpression(this);
  },
  ...rest,
});

export const identifierNode: IdentifierNode = ({ token }) => ({
  type: ExpressionNodeType.Identifier,
  symbol: token.value,
  position: token.position,
  accept(visitor) {
    return visitor.visitIdentifier(this);
  },
});

export const numberLiteralNode: NumberLiteralNode = ({ token }) => ({
  type: ExpressionNodeType.NumberLiteral,
  value: parseFloat(token.value),
  position: token.position,
  accept(visitor) {
    return visitor.visitNumberLiteral(this);
  },
});

export const stringLiteralNode: StringLiteralNode = ({ token }) => ({
  type: ExpressionNodeType.StringLiteral,
  value: token.value,
  position: token.position,
  accept(visitor) {
    return visitor.visitStringLiteral(this);
  },
});

export const trueLiteralNode: TrueLiteralNode = ({ token }) => ({
  type: ExpressionNodeType.TrueLiteral,
  value: LiteralValues.True,
  position: token.position,
  accept(visitor) {
    return visitor.visitTrueLiteral(this);
  },
});

export const falseLiteralNode: FalseLiteralNode = ({ token }) => ({
  type: ExpressionNodeType.FalseLiteral,
  value: LiteralValues.False,
  position: token.position,
  accept(visitor) {
    return visitor.visitFalseLiteral(this);
  },
});

export const nilLiteralNode: NilLiteralNode = ({ token }) => ({
  type: ExpressionNodeType.NilLiteral,
  value: LiteralValues.Nil,
  position: token.position,
  accept(visitor) {
    return visitor.visitNilLiteral(this);
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
    return visitor.visitObjectLiteral(this);
  },
  ...rest,
});
