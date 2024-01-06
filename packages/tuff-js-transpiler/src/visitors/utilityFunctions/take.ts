import * as t from '@babel/types';
import { FunctionDeclaration as JSFunctionDeclaration } from '@babel/types';

// Original JavaScript 'take' function:
//
// function take(list, number) {
//   if (typeof list === 'string' && typeof number === 'number') {
//     if (number >= 0 && number < list.length) {
//       return list[number];
//     } else {
//       throw new Error(
//         'Index out of bounds: Number must be within the length of the string',
//       );
//     }
//   }

//   throw new Error(
//     `Invalid argument type: take function expects a string and a number. Received ${typeof list} and ${typeof number} instead.`,
//   );
// }

export function createTakeFunction(): JSFunctionDeclaration {
  const listArgument = t.identifier('list');
  const numberArgument = t.identifier('number');

  const functionBody = t.blockStatement([
    // if (typeof list === 'string' && typeof number === 'number') { ... }
    t.ifStatement(
      t.logicalExpression(
        '&&',
        t.binaryExpression(
          '===',
          t.unaryExpression('typeof', listArgument),
          t.stringLiteral('string'),
        ),
        t.binaryExpression(
          '===',
          t.unaryExpression('typeof', numberArgument),
          t.stringLiteral('number'),
        ),
      ),
      t.blockStatement([
        // Index range check
        t.ifStatement(
          t.logicalExpression(
            '&&',
            t.binaryExpression('>=', numberArgument, t.numericLiteral(0)),
            t.binaryExpression(
              '<',
              numberArgument,
              t.memberExpression(listArgument, t.identifier('length')),
            ),
          ),
          t.returnStatement(
            t.memberExpression(listArgument, numberArgument, true),
          ),
          // Else throw "Index out of bounds" error
          t.throwStatement(
            t.newExpression(t.identifier('Error'), [
              t.stringLiteral(
                'Index out of bounds: Number must be within the length of the string',
              ),
            ]),
          ),
        ),
      ]),
      // Else throw "Invalid argument types" error
      t.throwStatement(
        t.newExpression(t.identifier('Error'), [
          t.templateLiteral(
            [
              t.templateElement({
                raw: 'Invalid argument types for "take" function: Expected a string and a number. Received ',
                cooked:
                  'Invalid argument types for "take" function: Expected a string and a number. Received ',
              }),
              t.templateElement({ raw: ' and ', cooked: ' and ' }, false),
              t.templateElement(
                { raw: ' instead.', cooked: ' instead.' },
                true,
              ),
            ],
            [
              t.unaryExpression('typeof', listArgument),
              t.unaryExpression('typeof', numberArgument),
            ],
          ),
        ]),
      ),
    ),
  ]);

  return t.functionDeclaration(
    t.identifier('take'),
    [listArgument, numberArgument],
    functionBody,
  );
}
