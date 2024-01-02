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

export const armenianAlphabetTranslit = {
  ա: 'a',
  բ: 'b',
  գ: 'g',
  դ: 'd',
  ե: 'e',
  զ: 'z',
  է: 'e',
  ը: 'ah',
  թ: 't',
  ժ: 'zh',
  ի: 'i',
  լ: 'l',
  խ: 'kh',
  ծ: 'ts',
  կ: 'k',
  հ: 'h',
  ձ: 'dz',
  ղ: 'gh',
  ճ: 'j',
  մ: 'm',
  յ: 'y',
  ն: 'n',
  շ: 'sh',
  ո: 'o',
  չ: 'ch',
  պ: 'p',
  ջ: 'j',
  ռ: 'r',
  ս: 's',
  վ: 'v',
  տ: 't',
  ր: 'r',
  ց: 'ts',
  ւ: 'w',
  փ: 'p',
  ք: 'k',
  օ: 'o',
  և: 'ev',
  ֆ: 'f',
  Ա: 'A',
  Բ: 'B',
  Գ: 'G',
  Դ: 'D',
  Ե: 'E',
  Զ: 'Z',
  Է: 'E',
  Ը: 'Ah',
  Թ: 'T',
  Ժ: 'Zh',
  Ի: 'I',
  Լ: 'L',
  Խ: 'Kh',
  Ծ: 'Ts',
  Կ: 'K',
  Հ: 'H',
  Ձ: 'Dz',
  Ղ: 'Gh',
  Ճ: 'J',
  Մ: 'M',
  Յ: 'Y',
  Ն: 'N',
  Շ: 'Sh',
  Ո: 'O',
  Չ: 'Ch',
  Պ: 'P',
  Ջ: 'J',
  Ռ: 'R',
  Ս: 'S',
  Վ: 'V',
  Տ: 'T',
  Ր: 'R',
  Ց: 'Ts',
  Ւ: 'W',
  Փ: 'P',
  Ք: 'K',
  Օ: 'O',
  Ֆ: 'F',
} as const;

export type ArmenianAlphabetTranslitKeys =
  keyof typeof armenianAlphabetTranslit;

export type ArmenianAlphabetTranslitValues =
  (typeof armenianAlphabetTranslit)[ArmenianAlphabetTranslitKeys];
