import * as t from '@babel/types';
import { FunctionDeclaration as JSFunctionDeclaration } from '@babel/types';

// Original JavaScript 'tuffScriptSlice' function:
//
// function tuffScriptSlice(input, start, end) {
//   if (typeof input === 'string' || Array.isArray(input)) {
//     // Ensure the start and end are within bounds and are numbers
//     const safeStart = typeof start === 'number' ? Math.max(0, start) : 0;
//     const safeEnd =
//       typeof end === 'number' ? Math.min(input.length, end) : input.length;

//     return input.slice(safeStart, safeEnd);
//   }

//   throw new Error(
//     `Invalid argument type: slice  function expects a string or array. Received: ${typeof input}`,
//   );
// }
export function createTuffScriptSliceFunction(): JSFunctionDeclaration {
  const inputArgument = t.identifier('input');
  const startArgument = t.identifier('start');
  const endArgument = t.identifier('end');

  const functionBody = t.blockStatement([
    t.ifStatement(
      // if (typeof input === 'string' || Array.isArray(input)) {...}
      t.logicalExpression(
        '||',
        t.binaryExpression(
          '===',
          t.unaryExpression('typeof', inputArgument),
          t.stringLiteral('string'),
        ),
        t.callExpression(
          t.memberExpression(t.identifier('Array'), t.identifier('isArray')),
          [inputArgument],
        ),
      ),
      t.blockStatement([
        // const safeStart = typeof start === 'number' ? Math.max(0, start) : 0;
        t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier('safeStart'),
            t.conditionalExpression(
              t.binaryExpression(
                '===',
                t.unaryExpression('typeof', startArgument),
                t.stringLiteral('number'),
              ),
              t.callExpression(
                t.memberExpression(t.identifier('Math'), t.identifier('max')),
                [t.numericLiteral(0), startArgument],
              ),
              t.numericLiteral(0),
            ),
          ),
        ]),
        // const safeEnd = typeof end === 'number' ? Math.min(input.length, end) : input.length;
        t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier('safeEnd'),
            t.conditionalExpression(
              t.binaryExpression(
                '===',
                t.unaryExpression('typeof', endArgument),
                t.stringLiteral('number'),
              ),
              t.callExpression(
                t.memberExpression(t.identifier('Math'), t.identifier('min')),
                [
                  t.memberExpression(inputArgument, t.identifier('length')),
                  endArgument,
                ],
              ),
              t.memberExpression(inputArgument, t.identifier('length')),
            ),
          ),
        ]),
        // return input.slice(safeStart, safeEnd);
        t.returnStatement(
          t.callExpression(
            t.memberExpression(inputArgument, t.identifier('slice')),
            [t.identifier('safeStart'), t.identifier('safeEnd')],
          ),
        ),
      ]),
      // else throw new Error(...)
      t.throwStatement(
        t.newExpression(t.identifier('Error'), [
          t.stringLiteral(
            `Invalid argument type: slice  function expects a string or array. Received: ${typeof inputArgument}`,
          ),
        ]),
      ),
    ),
  ]);

  return t.functionDeclaration(
    t.identifier('tuffScriptSlice'),
    [inputArgument, startArgument, endArgument],
    functionBody,
  );
}
