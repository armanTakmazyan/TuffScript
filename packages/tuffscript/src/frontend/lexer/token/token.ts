import { TokenType } from './tokenType';

interface TokenArgs {
  type: TokenType;
  value: string;
  position: number;
}

export class Token {
  type: TokenType;
  value: string;
  position: number;

  constructor({ type, value, position }: TokenArgs) {
    this.type = type;
    this.value = value;
    this.position = position;
  }
}
