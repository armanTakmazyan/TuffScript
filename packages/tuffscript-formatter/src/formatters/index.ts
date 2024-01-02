import { UnaryOperators, KeywordValues } from 'tuffscript/token/constants';
import {
  ExpressionNodeType,
  FunctionDeclaration,
  AssignmentExpression,
  IfExpression,
  ObjectLiteral,
  BinaryExpression,
  UnaryExpression,
  MemberExpression,
  CallExpression,
  Identifier,
  NumberLiteral,
  StringLiteral,
  TrueLiteral,
  FalseLiteral,
  NilLiteral,
} from 'tuffscript/ast/types';
import { createIndentation } from '../helpers';
import {
  FormatBlockArgs,
  FormatFuntionDeclarationArgs,
  FormatAssignmentExpressionArgs,
  FormatIfExpressionArgs,
  FormatObjectLiteralArgs,
  FormatBinaryExpressionArgs,
  FormatUnaryExpressionArgs,
  FormatMemberExpressionArgs,
  FormatCallExpressionArgs,
  FormatPrimaryExpressionArgs,
  FormatterVisitor,
  FormatterVisitorConstructorArgs,
} from './types';
import { StringBuilder } from '../stringBuilder';

export function formatFunctionDeclaration(
  this: FormatterVisitor,
  { astNode }: FormatFuntionDeclarationArgs,
): void {
  this.stringBuilder.append({ value: KeywordValues.Function });
  this.stringBuilder.append({ value: ` ${astNode.name.symbol}` });
  this.stringBuilder.append({ value: '(' });
  this.stringBuilder.append({
    value: astNode.arguments.map(argument => argument.symbol).join(', '),
  });
  this.stringBuilder.append({ value: `) ${KeywordValues.Do}\n` });
  this.formatBlock({ block: astNode.body });
  this.stringBuilder.append({
    value:
      createIndentation({ indentationLevel: this.indentationLevel }) +
      `${KeywordValues.End}`,
  });
}

export function formatAssignmentExpression(
  this: FormatterVisitor,
  { astNode }: FormatAssignmentExpressionArgs,
): void {
  this.stringBuilder.append({ value: `${KeywordValues.Store} ` });
  astNode.value.accept(this);
  this.stringBuilder.append({ value: ' ' });
  astNode.assignee.accept(this);
  this.stringBuilder.append({ value: ` ${KeywordValues.ContainmentSuffix}` });
}

function formatIfExpression(
  this: FormatterVisitor,
  { astNode }: FormatIfExpressionArgs,
): void {
  this.stringBuilder.append({ value: `${KeywordValues.If} ` });
  astNode.condition.accept(this);
  this.stringBuilder.append({ value: ` ${KeywordValues.Do}\n` });
  this.formatBlock({ block: astNode.thenBody });
  this.stringBuilder.append({
    value: createIndentation({ indentationLevel: this.indentationLevel }),
  });
  this.stringBuilder.append({ value: `${KeywordValues.Else}\n` });
  this.formatBlock({ block: astNode.elseBody });
  this.stringBuilder.append({
    value: createIndentation({ indentationLevel: this.indentationLevel }),
  });
  this.stringBuilder.append({ value: `${KeywordValues.End}` });
}

export function formatObjectLiteral(
  this: FormatterVisitor,
  { astNode }: FormatObjectLiteralArgs,
): void {
  this.stringBuilder.append({ value: '{\n' });
  const properties = astNode.properties;

  this.withIncreasedIndentation(() => {
    properties.forEach((property, index) => {
      const newIndentationLevel = createIndentation({
        indentationLevel: this.indentationLevel + 1,
      });

      if (property.value) {
        this.stringBuilder.append({
          value: newIndentationLevel + property.key + ': ',
        });
        property.value.accept(this);
      } else {
        this.stringBuilder.append({
          value: newIndentationLevel + property.key,
        });
      }
      // Add a comma if it's not the last property
      if (index < properties.length - 1) {
        this.stringBuilder.append({ value: ',' });
      }

      this.stringBuilder.append({ value: '\n' });
    });
  });

  this.stringBuilder.append({
    value: createIndentation({ indentationLevel: this.indentationLevel }) + '}',
  });
}

export function formatBinaryExpression(
  this: FormatterVisitor,
  { astNode }: FormatBinaryExpressionArgs,
): void {
  astNode.left.accept(this);
  this.stringBuilder.append({ value: ` ${astNode.operator} ` });
  astNode.right.accept(this);
}

export function formatUnaryExpression(
  this: FormatterVisitor,
  { astNode }: FormatUnaryExpressionArgs,
): void {
  this.stringBuilder.append({
    value: `${astNode.operator}${
      astNode.operator === UnaryOperators.Not ? ' ' : ''
    }`,
  });
  astNode.argument.accept(this);
}

export function formatMemberExpression(
  this: FormatterVisitor,
  { astNode }: FormatMemberExpressionArgs,
): void {
  astNode.object.accept(this);

  if (astNode.property.type === ExpressionNodeType.Identifier) {
    this.stringBuilder.append({ value: '.' });
    astNode.property.accept(this);
  }
  if (astNode.property.type !== ExpressionNodeType.Identifier) {
    this.stringBuilder.append({ value: '[' });
    astNode.property.accept(this);
    this.stringBuilder.append({ value: ']' });
  }
}

export function formatCallExpression(
  this: FormatterVisitor,
  { astNode }: FormatCallExpressionArgs,
): void {
  astNode.caller.accept(this);

  this.stringBuilder.append({ value: '(' });
  for (const [argumentIndex, argument] of astNode.arguments.entries()) {
    argument.accept(this);
    if (argumentIndex < astNode.arguments.length - 1) {
      this.stringBuilder.append({ value: ',' });
    }
  }
  this.stringBuilder.append({ value: ')' });
}

export function formatPrimaryExpression(
  this: FormatterVisitor,
  { astNode }: FormatPrimaryExpressionArgs,
): void {
  switch (astNode.type) {
    case ExpressionNodeType.StringLiteral: {
      this.stringBuilder.append({ value: `'${astNode.value}'` });
      break;
    }
    case ExpressionNodeType.NumberLiteral:
    case ExpressionNodeType.FalseLiteral:
    case ExpressionNodeType.TrueLiteral:
    case ExpressionNodeType.NilLiteral: {
      this.stringBuilder.append({ value: `${astNode.value}` });
      break;
    }
    case ExpressionNodeType.Identifier: {
      this.stringBuilder.append({ value: astNode.symbol });
      break;
    }
    default: {
      throw new Error(`Unsupported expression type: ${astNode}`);
    }
  }
}

export class Formatter implements FormatterVisitor {
  stringBuilder: StringBuilder;
  indentationLevel: number;

  constructor({
    stringBuilder,
    indentationLevel,
  }: FormatterVisitorConstructorArgs) {
    this.stringBuilder = stringBuilder;
    this.indentationLevel = indentationLevel;
  }

  // Increases indentation for nested blocks (e.g., functions, if statements).
  withIncreasedIndentation(callback: () => void): void {
    this.indentationLevel++;
    callback.call(this);
    this.indentationLevel--;
  }

  formatBlock(this: FormatterVisitor, { block }: FormatBlockArgs): void {
    this.withIncreasedIndentation(function (this: FormatterVisitor) {
      for (const expression of block) {
        this.stringBuilder.append({
          value: createIndentation({ indentationLevel: this.indentationLevel }),
        });
        expression.accept(this);
        this.stringBuilder.append({ value: '\n' });
      }
    });
  }

  visitFunctionDeclaration(node: FunctionDeclaration): void {
    formatFunctionDeclaration.call(this, { astNode: node });
  }

  visitAssignmentExpression(node: AssignmentExpression): void {
    formatAssignmentExpression.call(this, { astNode: node });
  }

  visitIfExpression(node: IfExpression): void {
    formatIfExpression.call(this, { astNode: node });
  }

  visitObjectLiteral(node: ObjectLiteral): void {
    formatObjectLiteral.call(this, { astNode: node });
  }

  visitBinaryExpression(node: BinaryExpression): void {
    formatBinaryExpression.call(this, { astNode: node });
  }

  visitUnaryExpression(node: UnaryExpression): void {
    formatUnaryExpression.call(this, { astNode: node });
  }

  visitMemberExpression(node: MemberExpression): void {
    formatMemberExpression.call(this, { astNode: node });
  }

  visitCallExpression(node: CallExpression): void {
    formatCallExpression.call(this, { astNode: node });
  }

  visitIdentifier(node: Identifier): void {
    formatPrimaryExpression.call(this, { astNode: node });
  }

  visitNumberLiteral(node: NumberLiteral): void {
    formatPrimaryExpression.call(this, { astNode: node });
  }

  visitStringLiteral(node: StringLiteral): void {
    formatPrimaryExpression.call(this, { astNode: node });
  }

  visitTrueLiteral(node: TrueLiteral): void {
    formatPrimaryExpression.call(this, { astNode: node });
  }

  visitFalseLiteral(node: FalseLiteral): void {
    formatPrimaryExpression.call(this, { astNode: node });
  }

  visitNilLiteral(node: NilLiteral): void {
    formatPrimaryExpression.call(this, { astNode: node });
  }
}
