import { UnaryOperators, KeywordValues } from 'tuffscript/token/constants';
import { ExpressionNodeType } from 'tuffscript/ast/types';
import { createIndentation } from '../helpers';
import {
  FormBlockArgs,
  FormatFuntionDeclarationArgs,
  FormatAssignmentExpressionArgs,
  FormatIfExpressionArgs,
  FormatObjectLiteralArgs,
  FormatBinaryExpressionArgs,
  FormatUnaryExpressionArgs,
  FormatMemberExpressionArgs,
  FormatCallExpressionArgs,
  FormatPrimaryExpressionArgs,
  FormatAST,
} from './types';

export function formatBlock({
  block,
  stringBuilder,
  indentationLevel,
}: FormBlockArgs): void {
  for (const expression of block) {
    stringBuilder.append({ value: createIndentation({ indentationLevel }) });
    formatAST({ astNode: expression, indentationLevel, stringBuilder });
    stringBuilder.append({ value: '\n' });
  }
}

export function formatFunctionDeclaration({
  astNode,
  stringBuilder,
  indentationLevel,
}: FormatFuntionDeclarationArgs): void {
  stringBuilder.append({ value: KeywordValues.Function });
  stringBuilder.append({ value: ` ${astNode.name}` });
  stringBuilder.append({ value: '(' });
  stringBuilder.append({ value: astNode.arguments.join(', ') });
  stringBuilder.append({ value: `) ${KeywordValues.Do}\n` });
  formatBlock({
    block: astNode.body,
    indentationLevel: indentationLevel + 1,
    stringBuilder,
  });
  stringBuilder.append({
    value: createIndentation({ indentationLevel }) + `${KeywordValues.End}`,
  });
}

export function formatAssignmentExpression({
  astNode,
  stringBuilder,
  indentationLevel,
}: FormatAssignmentExpressionArgs): void {
  stringBuilder.append({ value: `${KeywordValues.Store} ` });
  formatAST({ astNode: astNode.value, indentationLevel, stringBuilder });
  stringBuilder.append({
    value: ` ${astNode.assigne} ${KeywordValues.ContainmentSuffix}`,
  });
}

function formatIfExpression({
  astNode,
  indentationLevel,
  stringBuilder,
}: FormatIfExpressionArgs) {
  stringBuilder.append({ value: `${KeywordValues.If} ` });
  formatAST({
    astNode: astNode.condition,
    indentationLevel,
    stringBuilder,
  });
  stringBuilder.append({ value: ` ${KeywordValues.Do}\n` });
  formatBlock({
    block: astNode.thenBody,
    stringBuilder,
    indentationLevel: indentationLevel + 1,
  });
  stringBuilder.append({ value: createIndentation({ indentationLevel }) });
  stringBuilder.append({ value: `${KeywordValues.Else}\n` });

  formatBlock({
    block: astNode.elseBody,
    indentationLevel: indentationLevel + 1,
    stringBuilder,
  });

  stringBuilder.append({ value: `${KeywordValues.End}` });
}

export function formatObjectLiteral({
  astNode,
  indentationLevel,
  stringBuilder,
}: FormatObjectLiteralArgs): void {
  stringBuilder.append({ value: '{\n' });
  const properties = astNode.properties;

  properties.forEach((property, index) => {
    const newIndentationLevel = createIndentation({
      indentationLevel: indentationLevel + 1,
    });
    if (property.value) {
      stringBuilder.append({
        value: newIndentationLevel + property.key + ': ',
      });
      formatAST({
        astNode: property.value,
        indentationLevel,
        stringBuilder,
      });
      // Add a comma if it's not the last property
      if (index < properties.length - 1) {
        stringBuilder.append({ value: ',' });
      }
    }
    // TODO: Check this part
    stringBuilder.append({ value: ',' });

    stringBuilder.append({ value: '\n' });
  });

  stringBuilder.append({
    value: createIndentation({ indentationLevel }) + '}',
  });
}

export function formatBinaryExpression({
  astNode,
  indentationLevel,
  stringBuilder,
}: FormatBinaryExpressionArgs): void {
  formatAST({ astNode: astNode.left, indentationLevel, stringBuilder });
  stringBuilder.append({ value: ` ${astNode.operator} ` });
  formatAST({ astNode: astNode.right, indentationLevel, stringBuilder });
}

export function formatUnaryExpression({
  astNode,
  indentationLevel,
  stringBuilder,
}: FormatUnaryExpressionArgs): void {
  stringBuilder.append({
    value: `${astNode.operator}${
      astNode.operator === UnaryOperators.Not ? ' ' : ''
    }`,
  });
  formatAST({ astNode: astNode.argument, indentationLevel, stringBuilder });
}

// TODO: catch dynamically computed values
export function formatMemberExpression({
  astNode,
  indentationLevel,
  stringBuilder,
}: FormatMemberExpressionArgs): void {
  formatAST({
    astNode: astNode.object,
    indentationLevel,
    stringBuilder,
  });
  if (astNode.property.type === ExpressionNodeType.Identifier) {
    stringBuilder.append({ value: '.' });
    formatAST({
      astNode: astNode.property,
      indentationLevel,
      stringBuilder,
    });
  }
  if (astNode.property.type !== ExpressionNodeType.Identifier) {
    stringBuilder.append({ value: '[' });
    formatAST({
      astNode: astNode.property,
      indentationLevel,
      stringBuilder,
    });
    stringBuilder.append({ value: ']' });
  }
}

export function formatCallExpression({
  astNode,
  stringBuilder,
  indentationLevel,
}: FormatCallExpressionArgs): void {
  formatAST({
    astNode: astNode.caller,
    indentationLevel,
    stringBuilder,
  });

  stringBuilder.append({ value: '(' });
  for (const [argumentIndex, argument] of astNode.arguments.entries()) {
    formatAST({
      astNode: argument,
      indentationLevel,
      stringBuilder,
    });
    if (argumentIndex < astNode.arguments.length - 1) {
      stringBuilder.append({ value: ',' });
    }
  }
  stringBuilder.append({ value: ')' });
}

export function formatPrimaryExpression({
  astNode,
  stringBuilder,
}: FormatPrimaryExpressionArgs): void {
  switch (astNode.type) {
    case ExpressionNodeType.StringLiteral: {
      stringBuilder.append({ value: `'${astNode.value}'` });
      break;
    }
    case ExpressionNodeType.NumberLiteral:
    case ExpressionNodeType.FalseLiteral:
    case ExpressionNodeType.TrueLiteral:
    case ExpressionNodeType.NilLiteral: {
      stringBuilder.append({ value: `${astNode.value}` });
      break;
    }
    case ExpressionNodeType.Identifier: {
      stringBuilder.append({ value: astNode.symbol });
      break;
    }
    default: {
      throw new Error(`Unsupported expression type: ${astNode}`);
    }
  }
}

export const formatAST: FormatAST = ({
  astNode,
  indentationLevel,
  stringBuilder,
}) => {
  switch (astNode.type) {
    case ExpressionNodeType.FunctionDeclaration: {
      formatFunctionDeclaration({
        astNode,
        indentationLevel,
        stringBuilder,
      });
      break;
    }
    case ExpressionNodeType.AssignmentExpression: {
      formatAssignmentExpression({
        astNode,
        indentationLevel,
        stringBuilder,
      });
      break;
    }
    case ExpressionNodeType.IfExpression: {
      formatIfExpression({
        astNode,
        indentationLevel,
        stringBuilder,
      });
      break;
    }
    case ExpressionNodeType.ObjectLiteral: {
      formatObjectLiteral({
        astNode,
        indentationLevel,
        stringBuilder,
      });
      break;
    }
    case ExpressionNodeType.BinaryExpression: {
      formatBinaryExpression({
        astNode,
        indentationLevel,
        stringBuilder,
      });
      break;
    }
    case ExpressionNodeType.UnaryExpression: {
      formatUnaryExpression({
        astNode,
        indentationLevel,
        stringBuilder,
      });
      break;
    }
    case ExpressionNodeType.MemberExpression: {
      formatMemberExpression({
        astNode,
        indentationLevel,
        stringBuilder,
      });
      break;
    }
    case ExpressionNodeType.CallExpression: {
      formatCallExpression({
        astNode,
        indentationLevel,
        stringBuilder,
      });
      break;
    }
    case ExpressionNodeType.Identifier:
    case ExpressionNodeType.NumberLiteral:
    case ExpressionNodeType.StringLiteral:
    case ExpressionNodeType.TrueLiteral:
    case ExpressionNodeType.FalseLiteral:
    case ExpressionNodeType.NilLiteral: {
      formatPrimaryExpression({
        astNode,
        indentationLevel,
        stringBuilder,
      });
      break;
    }
    default: {
      throw new Error(
        `This AST Node has not yet been setup for interpretation.\n ${astNode}`,
      );
    }
  }
};
