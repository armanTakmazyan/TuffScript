import * as t from '@babel/types';
import { FunctionDeclaration as JSFunctionDeclaration } from '@babel/types';

// Original JavaScript 'tuffScriptCharCode' function:
//
// function tuffScriptCharCode(character, index = 0) {
//   if (typeof character === 'string' && Number.isInteger(index) && index >= 0) {
//     return character.charCodeAt(index);
//   }

//   throw new Error(
//     `Invalid argument type: "tuffScriptCharCode" function expects a string and a non-negative integer index. Received type ${typeof character} and index ${index} instead.`,
//   );
// }

export function createTuffScriptCharCodeFunction(): JSFunctionDeclaration {
  const characterArgument = t.identifier('character');
  const indexArgument = t.identifier('index');

  const functionBody = t.blockStatement([
    // Check if character is a string and index is a non-negative integer
    t.ifStatement(
      t.logicalExpression(
        '&&',
        t.binaryExpression(
          '===',
          t.unaryExpression('typeof', characterArgument),
          t.stringLiteral('string'),
        ),
        t.logicalExpression(
          '&&',
          t.callExpression(
            t.memberExpression(
              t.identifier('Number'),
              t.identifier('isInteger'),
            ),
            [indexArgument],
          ),
          t.binaryExpression('>=', indexArgument, t.numericLiteral(0)),
        ),
      ),
      t.blockStatement([
        // Return the character code at the given index
        t.returnStatement(
          t.callExpression(
            t.memberExpression(characterArgument, t.identifier('charCodeAt')),
            [indexArgument], // Using the index parameter
          ),
        ),
      ]),
      // Throw error if arguments do not meet the expected types or values
      t.throwStatement(
        t.newExpression(t.identifier('Error'), [
          t.templateLiteral(
            [
              t.templateElement({
                raw: 'Invalid argument type: "tuffScriptCharCode" function expects a string and a non-negative integer index. Received type ',
                cooked:
                  'Invalid argument type: "tuffScriptCharCode" function expects a string and a non-negative integer index. Received type ',
              }),
              t.templateElement(
                { raw: ' and index ', cooked: ' and index ' },
                false,
              ),
              t.templateElement(
                { raw: ' instead.', cooked: ' instead.' },
                true,
              ),
            ],
            [t.unaryExpression('typeof', characterArgument), indexArgument], // Including both character and index in the error message
          ),
        ]),
      ),
    ),
  ]);

  return t.functionDeclaration(
    t.identifier('tuffScriptCharCode'),
    [characterArgument, indexArgument],
    functionBody,
  );
}
