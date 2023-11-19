import { KEYWORDS } from './constants';
import { Keyword, TokenKind } from './types';

export const isKeyword = (value: string): value is Keyword => {
  return KEYWORDS.includes(value as Keyword);
};

export const processTokenValue = ({
  tokenTypeName,
  tokenValue,
}: {
  tokenTypeName: TokenKind;
  tokenValue: string;
}): string => {
  if (tokenTypeName === TokenKind.String) {
    // Removes leading and trailing single quotes
    return tokenValue.slice(1, -1);
  }

  return tokenValue;
};
