import { CreateIndentation } from './types';

const defaultIdentationSize = 2;

export const createIndentation: CreateIndentation = ({ indentationLevel }) => {
  return ' '.repeat(indentationLevel * defaultIdentationSize);
};
