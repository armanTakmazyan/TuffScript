import { TokenType } from './tokenType';
import { Position } from './types';

interface TokenArgs {
  type: TokenType;
  value: string;
  position: Position;
}

export class Token {
  type: TokenType;
  value: string;
  position: Position;

  constructor({ type, value, position }: TokenArgs) {
    this.type = type;
    this.value = value;
    this.position = position;
  }
}
