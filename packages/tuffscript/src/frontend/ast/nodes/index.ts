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

export const identifierNode: IdentifierNode = ({ ...rest }) => ({
  type: ExpressionNodeType.Identifier,
  accept(visitor) {
    visitor.visitIdentifier(this);
  },
  ...rest,
});

export const numberLiteralNode: NumberLiteralNode = ({ ...rest }) => ({
  type: ExpressionNodeType.NumberLiteral,
  accept(visitor) {
    visitor.visitNumberLiteral(this);
  },
  ...rest,
});

export const stringLiteralNode: StringLiteralNode = ({ ...rest }) => ({
  type: ExpressionNodeType.StringLiteral,
  accept(visitor) {
    visitor.visitStringLiteral(this);
  },
  ...rest,
});

export const trueLiteralNode: TrueLiteralNode = () => ({
  type: ExpressionNodeType.TrueLiteral,
  accept(visitor) {
    visitor.visitTrueLiteral(this);
  },
  value: LiteralValues.True,
});

export const falseLiteralNode: FalseLiteralNode = () => ({
  type: ExpressionNodeType.FalseLiteral,
  accept(visitor) {
    visitor.visitFalseLiteral(this);
  },
  value: LiteralValues.False,
});

export const nilLiteralNode: NilLiteralNode = () => ({
  type: ExpressionNodeType.NilLiteral,
  accept(visitor) {
    visitor.visitNilLiteral(this);
  },
  value: LiteralValues.Nil,
});

export const createProperty: CreateProperty = ({ ...rest }) => ({
  type: 'Property',
  ...rest,
});

export const objectLiteralNode: ObjectLiteralNode = ({ ...rest }) => ({
  type: ExpressionNodeType.ObjectLiteral,
  accept(visitor) {
    visitor.visitObjectLiteral(this);
  },
  ...rest,
});
