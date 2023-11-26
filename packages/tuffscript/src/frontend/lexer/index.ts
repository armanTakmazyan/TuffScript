import { Token } from './token/token';
import { TokenKind } from './token/types';
import { processTokenValue } from './token/helpers';
import {
  TOKEN_PATTERNS_LIST,
  PUNCTUATION_TOKEN_PATTERNS,
} from './token/constants';

export class Lexer {
  sourceCode: string;
  position: number = 0;
  tokenList: Token[] = [];

  constructor(sourceCode: string) {
    this.sourceCode = sourceCode;
  }

  public lexAnalysis(): Token[] {
    while (this.position < this.sourceCode.length) {
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
        position: {
          start: this.position,
          end: this.position,
        },
      }),
    );

    return this.tokenList;
  }

  private nextToken(): Token | null {
    // EOF reached
    if (this.position >= this.sourceCode.length) return null;

    for (const tokenType of TOKEN_PATTERNS_LIST) {
      const regex = new RegExp(`^${tokenType.regex}`);
      const match = regex.exec(this.sourceCode.slice(this.position));
      const [matchedString] = match ?? [];

      if (matchedString) {
        const tokenEndPosition = this.position + matchedString.length;
        const token = new Token({
          type: tokenType,
          value: processTokenValue({
            tokenValue: matchedString,
            tokenTypeName: tokenType.name,
          }),
          position: {
            start: this.position,
            end: tokenEndPosition,
          },
        });

        this.position = tokenEndPosition;
        return token;
      }
    }

    const unexpectedCharacter = this.sourceCode[this.position];
    throw new Error(
      `Unexpected character ${unexpectedCharacter} at position ${this.position}.`,
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
