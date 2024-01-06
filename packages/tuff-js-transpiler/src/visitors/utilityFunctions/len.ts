import * as t from '@babel/types';
import { FunctionDeclaration as JSFunctionDeclaration } from '@babel/types';

// Original JavaScript 'len' function:
//
// function len(element) {
//   if (
//     element === null ||
//     (typeof element !== 'string' && typeof element !== 'object')
//   ) {
//     throw new Error(
//       `Invalid argument type: len function expects a string or a non-null object. Received ${typeof element} instead.`,
//     );
//   }
//   if (typeof element === 'string') {
//     return element.length;
//   }
//   return Object.keys(element).length;
// }

export function createLenFunction(): JSFunctionDeclaration {
  const elementArgument = t.identifier('element');

  const functionBody = t.blockStatement([
    // Check for null or other types that are not expected
    t.ifStatement(
      t.logicalExpression(
        '||',
        t.binaryExpression('===', elementArgument, t.nullLiteral()),
        t.logicalExpression(
          '&&',
          t.binaryExpression(
            '!==',
            t.unaryExpression('typeof', elementArgument),
            t.stringLiteral('string'),
          ),
          t.binaryExpression(
            '!==',
            t.unaryExpression('typeof', elementArgument),
            t.stringLiteral('object'),
          ),
        ),
      ),
      t.throwStatement(
        t.newExpression(t.identifier('Error'), [
          t.templateLiteral(
            [
              t.templateElement({
                raw: 'Invalid argument type: len function expects a string or a non-null object. Received ',
                cooked:
                  'Invalid argument type: len function expects a string or a non-null object. Received ',
              }),
              t.templateElement(
                { raw: ' instead.', cooked: ' instead.' },
                true,
              ),
            ],
            [t.unaryExpression('typeof', elementArgument)],
          ),
        ]),
      ),
    ),

    // Handle strings
    t.ifStatement(
      t.binaryExpression(
        '===',
        t.unaryExpression('typeof', elementArgument),
        t.stringLiteral('string'),
      ),
      t.returnStatement(
        t.memberExpression(elementArgument, t.identifier('length')),
      ),
    ),

    // Handle objects
    t.returnStatement(
      t.memberExpression(
        t.callExpression(
          t.memberExpression(t.identifier('Object'), t.identifier('keys')),
          [elementArgument],
        ),
        t.identifier('length'),
      ),
    ),
  ]);

  return t.functionDeclaration(
    t.identifier('len'),
    [elementArgument],
    functionBody,
  );
}
