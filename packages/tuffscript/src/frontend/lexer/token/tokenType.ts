import { TokenKind } from './types';

interface TokenTypeArgs {
  name: TokenKind;
  regex: string;
}

export class TokenType {
  name: TokenKind;
  regex: string;

  constructor({ name, regex }: TokenTypeArgs) {
    this.name = name;
    this.regex = regex;
  }
}
