import * as t from '@babel/types';
import { Identifier as JSIdentifier } from '@babel/types';
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
  armenianAlphabetTranslit,
  ArmenianAlphabetTranslitKeys,
} from './constants';
import { AssignmentExpression, ExpressionNodeType } from 'tuffscript/ast/types';

export function isIdentifierAssignment(
  node: AssignmentExpression,
): node is IdentifierAssignment {
  return node.assignee.type === ExpressionNodeType.Identifier;
}

export function isArmenianAlphabetTranslitKey(
  key: string,
): key is ArmenianAlphabetTranslitKeys {
  return Object.prototype.hasOwnProperty.call(armenianAlphabetTranslit, key);
}

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

export function transliterateArmenianToEnglish(armenianText: string): string {
  return armenianText
    .split('')
    .map(char =>
      isArmenianAlphabetTranslitKey(char)
        ? armenianAlphabetTranslit[char]
        : char,
    )
    .join('');
}

export function createTransliteratedIdentifier(symbol: string): JSIdentifier {
  const transliteratedSymbol = transliterateArmenianToEnglish(symbol);
  return t.identifier(transliteratedSymbol);
}
