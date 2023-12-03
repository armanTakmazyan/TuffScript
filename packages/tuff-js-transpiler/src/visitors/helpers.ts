import { JSUnaryOperator, JSBinaryOperator, JSLogicalOperator } from './types';
import {
  BinaryOperatorMappingDictionaryKeys,
  LogicalOperatorMappingDictionaryKeys,
  UnaryOperatorMappingDictionaryKeys,
  binaryOperatorMappingDictionary,
  logicalOperatorMappingDictionary,
  unaryOperatorMappingDictionary,
} from './constants';

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
