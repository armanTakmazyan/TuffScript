import * as t from '@babel/types';
import { VariableDeclaration as JSVariableDeclaration } from '@babel/types';

// Original JavaScript 'prompt' function:
//
// const prompt = require('prompt-sync')();

export const createPromptSyncFunction = (): JSVariableDeclaration => {
  const requireCall = t.callExpression(t.identifier('require'), [
    t.stringLiteral('prompt-sync'),
  ]);

  const promptSyncCall = t.callExpression(requireCall, []);

  return t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('prompt'), promptSyncCall),
  ]);
};
