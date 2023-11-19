import { TuffScriptFormatterArgs } from './types';
import { StringBuilder } from './stringBuilder';
import { Formatter } from './formatters';

export const tuffScriptFormatter = ({
  program,
}: TuffScriptFormatterArgs): string => {
  const stringBuilder = new StringBuilder();
  const formatter = new Formatter({ indentationLevel: 0, stringBuilder });

  for (const expression of program.body) {
    expression.accept(formatter);
    stringBuilder.append({ value: '\n\n' });
  }

  return stringBuilder.toString();
};
