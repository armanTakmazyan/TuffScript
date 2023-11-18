import { TuffScriptFormatterArgs } from './types';
import { StringBuilder } from './stringBuilder';
import { formatAST } from './formatters';

export const tuffScriptFormatter = ({
  program,
}: TuffScriptFormatterArgs): string => {
  const stringBuilder = new StringBuilder();
  for (const expression of program.body) {
    formatAST({
      astNode: expression,
      indentationLevel: 0,
      stringBuilder,
    });
    stringBuilder.append({ value: '\n\n' });
  }

  return stringBuilder.toString();
};
