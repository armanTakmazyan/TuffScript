import { BinaryOperators, UnaryOperators } from 'tuffscript/token/constants';

export const unaryOperatorMappingDictionary = {
  [UnaryOperators.Not]: '!',
  [UnaryOperators.Minus]: '-',
} as const;

export type UnaryOperatorMappingDictionaryKeys =
  keyof typeof unaryOperatorMappingDictionary;

export type UnaryOperatorMappingDictionaryValues =
  (typeof unaryOperatorMappingDictionary)[UnaryOperatorMappingDictionaryKeys];

export const binaryOperatorMappingDictionary = {
  [BinaryOperators.ADDITION]: '+',
  [BinaryOperators.SUBTRACTION]: '-',
  [BinaryOperators.MULTIPLICATION]: '*',
  [BinaryOperators.DIVISION]: '/',
  [BinaryOperators.MODULUS]: '%',
  [BinaryOperators.EQUALS]: '===',
  [BinaryOperators.GREATER_THAN]: '>',
  [BinaryOperators.LESS_THAN]: '<',
} as const;

export type BinaryOperatorMappingDictionaryKeys =
  keyof typeof binaryOperatorMappingDictionary;

export type BinaryOperatorMappingDictionaryValues =
  (typeof binaryOperatorMappingDictionary)[BinaryOperatorMappingDictionaryKeys];

export const logicalOperatorMappingDictionary = {
  [BinaryOperators.AND]: '&&',
  [BinaryOperators.OR]: '||',
} as const;

export type LogicalOperatorMappingDictionaryKeys =
  keyof typeof logicalOperatorMappingDictionary;

export type LogicalOperatorMappingDictionaryValues =
  (typeof logicalOperatorMappingDictionary)[LogicalOperatorMappingDictionaryKeys];
