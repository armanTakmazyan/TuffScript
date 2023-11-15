import { TokenKind } from './token/types';
import { Token } from './token/token';
import {
  TOKEN_PATTERNS_LIST,
  PUNCTUATION_TOKEN_PATTERNS,
} from './token/constants';

export class Lexer {
  sourceCode: string;
  pos: number = 0;
  tokenList: Token[] = [];

  constructor(sourceCode: string) {
    this.sourceCode = sourceCode;
  }

  public lexAnalysis(): Token[] {
    while (this.pos < this.sourceCode.length) {
      const token = this.nextToken();
      if (this.includeToken(token)) {
        this.tokenList.push(token);
      }
    }

    // Push EOF token to signal end of source code to the parser
    this.tokenList.push(
      new Token({
        type: PUNCTUATION_TOKEN_PATTERNS.EOF,
        value: '',
        position: this.pos,
      }),
    );

    return this.tokenList;
  }

  private nextToken(): Token | null {
    // EOF reached
    if (this.pos >= this.sourceCode.length) return null;

    for (const tokenType of TOKEN_PATTERNS_LIST) {
      const regex = new RegExp(`^${tokenType.regex}`);
      const match = regex.exec(this.sourceCode.slice(this.pos));
      const [matchedString] = match ?? [];

      if (matchedString) {
        const token = new Token({
          type: tokenType,
          value: matchedString,
          position: this.pos,
        });

        this.pos += matchedString.length;
        return token;
      }
    }

    const unexpectedCharacter = this.sourceCode[this.pos];
    throw new Error(
      `Unexpected character ${unexpectedCharacter} at position ${this.pos}.`,
    );
  }

  private includeToken(token: Token | null): token is Token {
    if (!token) return false;

    if (
      token.type.name === TokenKind.Space ||
      token.type.name === TokenKind.Newline
    ) {
      return false;
    }

    return true;
  }
}
