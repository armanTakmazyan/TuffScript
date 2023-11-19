import { CreateIndentation } from './types';

const defaultIdentationSize = 2;

export const createIndentation: CreateIndentation = ({ indentationLevel }) => {
  return ' '.repeat(indentationLevel * defaultIdentationSize);
};

export const convertEndOfLineToChars = (value: string): string => {
  switch (value) {
    case 'cr':
      return '\r';
    case 'crlf':
      return '\r\n';
    default:
      return '\n';
  }
};
