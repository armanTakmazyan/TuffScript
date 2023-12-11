import {
  JSBinaryOperator,
  JSUnaryOperator,
  JSLogicalOperator,
  IdentifierAssignment,
} from './types';
import {
  BinaryOperatorMappingDictionaryKeys,
  LogicalOperatorMappingDictionaryKeys,
  binaryOperatorMappingDictionary,
  UnaryOperatorMappingDictionaryKeys,
  logicalOperatorMappingDictionary,
  unaryOperatorMappingDictionary,
} from './constants';
import { AssignmentExpression, ExpressionNodeType } from 'tuffscript/ast/types';

export function convertToJSUnaryOperator(
  operator: string,
): JSUnaryOperator | null {
  return (
    unaryOperatorMappingDictionary[
      operator as UnaryOperatorMappingDictionaryKeys
    ] ?? null
  );
}

export function convertToJSBinaryOperator(
  operator: string,
): JSBinaryOperator | null {
  return (
    binaryOperatorMappingDictionary[
      operator as BinaryOperatorMappingDictionaryKeys
    ] ?? null
  );
}

export function convertToJSLogicalOperator(
  operator: string,
): JSLogicalOperator | null {
  return (
    logicalOperatorMappingDictionary[
      operator as LogicalOperatorMappingDictionaryKeys
    ] ?? null
  );
}

export function isIdentifierAssignment(
  node: AssignmentExpression,
): node is IdentifierAssignment {
  return node.assignee.type === ExpressionNodeType.Identifier;
}
