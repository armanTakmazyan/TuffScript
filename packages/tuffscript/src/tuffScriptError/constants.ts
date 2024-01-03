// TODO: We need to use this; perhaps it would be better to simply use an enum

export const LexicalErrorCodes = {
  UNEXPECTED_CHARACTER: 1,
  // Other lexical error codes...
} as const;

export const ParsingErrorCodes = {
  SYNTAX_ERROR: 1,
  // Other parsing error codes...
} as const;

export const InterpretationErrorCodes = {
  UNDEFINED_VARIABLE: 1,
  // Other interpretation error codes...
} as const;
