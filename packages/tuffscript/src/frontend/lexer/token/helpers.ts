import { KEYWORDS } from './constants';
import { Keyword } from './types';

export const isKeyword = (value: string): value is Keyword => {
  return KEYWORDS.includes(value as Keyword);
};
