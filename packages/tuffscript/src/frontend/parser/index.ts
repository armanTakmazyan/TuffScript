import { TuffScriptError } from '../../tuffScriptError';
import { TuffScriptErrorProperties } from '../../tuffScriptError/types';
import { TokenType } from '../lexer/token/tokenType';
import { TokenKind } from '../lexer/token/types';
import { Token } from '../lexer/token/token';
import { ExpressionPosition } from '../ast/expressionPosition';
import {
  Program,
  Expressions,
  Expression,
  Property,
  FunctionDeclaration,
  AssignmentExpression,
  IfExpression,
  PrimitiveExpression,
  ExpressionNodeType,
} from '../ast/types';
import {
  functionDeclarationNode,
  assignmentExpressionNode,
  ifExpressionNode,
  binaryExpressionNode,
  callExpressionNode,
  identifierNode,
  memberExpressionNode,
  numberLiteralNode,
  stringLiteralNode,
  trueLiteralNode,
  falseLiteralNode,
  nilLiteralNode,
  objectLiteralNode,
  unaryExpressionNode,
  createProperty,
} from '../ast/nodes';
import {
  KeywordValues,
  UnaryOperators,
  BinaryOperators,
  IDENTIFIER_TOKEN_PATTERNS,
  LITERAL_TOKEN_PATTERNS,
  KEYWORD_TOKEN_PATTERNS,
  PUNCTUATION_TOKEN_PATTERNS,
} from '../lexer/token/constants';

export interface ParserArgs {
  tokens: Token[];
}

export class Parser {
  tokens: Token[];
  position: number = 0;

  constructor({ tokens }: ParserArgs) {
    this.tokens = tokens;
  }

  at(): Token {
    return this.tokens[this.position];
  }

  isEOF(): boolean {
    return this.at().type.name === TokenKind.EOF;
  }

  eat(): Token {
    const previousToken = this.at();
    if (this.isEOF()) {
      return previousToken;
    }
    this.position += 1;
    return previousToken;
  }

  match(...expected: TokenType[]): Token | null {
    if (this.position < this.tokens.length) {
      const currentToken = this.at();
      const isExpectedToken = expected.find(
        type => type.name === currentToken.type.name,
      );
      if (isExpectedToken) {
        return this.eat();
      }
    }
    return null;
  }

  require({
    expected,
    message,
  }: {
    expected: TokenType[];
    message?: string;
  }): Token {
    const token = this.match(...expected);
    const currentToken = this.at();

    if (!token) {
      this.throwError({
        message: `${message ? `${message}. ` : ''}At position ${
          this.position
        }, expected ${expected[0].name}. But got ${currentToken.value}`,
        position: currentToken.position,
      });
    }
    return token;
  }

  throwError({ message, position }: TuffScriptErrorProperties): never {
    throw new TuffScriptError({ message, position });
  }

  produceAST(): Program {
    const program: Program = {
      type: 'Program',
      body: [],
    };

    while (!this.isEOF()) {
      program.body.push(this.parseExpression());
    }

    return program;
  }

  parseExpression(): Expression {
    switch (this.at().type.name) {
      case TokenKind.Function:
        return this.parseFunctionDeclaration();
      case TokenKind.Store:
        return this.parseAssignmentExpression();
      case TokenKind.If:
        return this.parseIfExpression();
      default:
        return this.parsePrimitiveExpression();
    }
  }

  parseFunctionDeclaration(): FunctionDeclaration {
    const functionKeyword = this.eat(); // eat Function keyword
    const functionName = this.require({
      expected: [IDENTIFIER_TOKEN_PATTERNS.Identifier],
      message: `Expected a function name following the "${KeywordValues.Function}" keyword`,
    });

    const functionArguments = this.parseArguments().map(argument => {
      if (argument.type !== ExpressionNodeType.Identifier) {
        this.throwError({
          message: `Function parameter must be an identifier, found '${argument.type}' instead`,
          position: argument.position,
        });
      }
      return argument;
    });

    this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.Do],
      message: 'Expected function body following declaration',
    });

    const body: Expressions = [];

    while (!this.isEOF() && this.at().type.name !== TokenKind.End) {
      body.push(this.parseExpression());
    }

    const endKeyword = this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.End],
      message: `Closing keyword "${KeywordValues.End}" expected at the end of the function declaration`,
    });

    const functionDeclaration = functionDeclarationNode({
      body,
      name: identifierNode({ token: functionName }),
      arguments: functionArguments,
      position: ExpressionPosition.from({
        start: functionKeyword,
        end: endKeyword,
      }),
    });

    return functionDeclaration;
  }

  parseAssignmentExpression(): AssignmentExpression {
    const storeKeyword = this.eat(); // eat Store keyword
    const primitiveExpression = this.parsePrimitiveExpression();
    const assignee = this.parseMemberExpression();

    if (
      assignee.type !== ExpressionNodeType.Identifier &&
      assignee.type !== ExpressionNodeType.MemberExpression
    ) {
      this.throwError({
        message:
          'Invalid assignment target. Expecting an identifier or member expression',
        position: assignee.position,
      });
    }

    const containmentSuffix = this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.ContainmentSuffix],
      message: `Incorrect Assignment Format. Ensure the format: ${KeywordValues.Store} <primitive_expression> <variable_name> ${KeywordValues.ContainmentSuffix}`,
    });

    const declaration: AssignmentExpression = assignmentExpressionNode({
      assignee: assignee,
      value: primitiveExpression,
      position: ExpressionPosition.from({
        start: storeKeyword,
        end: containmentSuffix,
      }),
    });

    return declaration;
  }

  parseIfExpression(): IfExpression {
    const ifKeyword = this.eat(); // eat If keyword
    const condition = this.parsePrimitiveExpression();
    this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.Do],
      message: `Expected the "${KeywordValues.Do}" keyword for a correct if expression`,
    });

    const thenBody: Expressions = [];

    while (!this.isEOF() && this.at().type.name !== TokenKind.Else) {
      thenBody.push(this.parseExpression());
    }

    this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.Else],
      message: `Expected the "${KeywordValues.Else}" keyword for a correct if expression`,
    });

    const elseBody: Expressions = [];

    while (!this.isEOF() && this.at().type.name !== TokenKind.End) {
      elseBody.push(this.parseExpression());
    }

    const endKeyword = this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.End],
      message: `Expected the "${KeywordValues.End}" keyword for a correct if expression`,
    });

    const ifExpression = ifExpressionNode({
      condition,
      thenBody,
      elseBody,
      position: ExpressionPosition.from({
        start: ifKeyword,
        end: endKeyword,
      }),
    });

    return ifExpression;
  }

  parsePrimitiveExpression(): PrimitiveExpression {
    return this.parseObjectExpression();
  }

  parseObjectExpression(): PrimitiveExpression {
    if (this.at().type.name !== TokenKind.OpenBrace) {
      return this.parseLogicalOrExpression();
    }

    const openBrace = this.eat(); // eat open brace
    const properties: Property[] = [];

    while (!this.isEOF() && this.at().type.name !== TokenKind.CloseBrace) {
      const key = this.require({
        expected: [
          IDENTIFIER_TOKEN_PATTERNS.Identifier,
          LITERAL_TOKEN_PATTERNS.String,
        ],
        message: 'Object literal key expected',
      });

      // Handle shorthand property notation in object literals (e.g., { key, })
      if (key.type.name === TokenKind.Identifier) {
        properties.push(
          createProperty({
            token: key,
          }),
        );

        const currentToken = this.at();
        if (
          currentToken.type.name !== TokenKind.Comma &&
          currentToken.type.name !== TokenKind.CloseBrace
        ) {
          this.throwError({
            message:
              'Expected a comma (,) or a closing brace (}) after an identifier in shorthand property notation within the object literal',
            position: currentToken.position,
          });
        }
        if (currentToken.type.name === TokenKind.Comma) {
          this.eat();
        }
        continue;
      }

      // Expect a colon after property key in object literal (e.g., { key: value })
      this.require({
        expected: [PUNCTUATION_TOKEN_PATTERNS.Colon],
        message: 'Missing colon following identifier in ObjectExpression',
      });

      const value = this.parsePrimitiveExpression();

      properties.push(
        createProperty({
          token: key,
          value,
        }),
      );

      if (this.at().type.name !== TokenKind.CloseBrace) {
        this.require({
          expected: [PUNCTUATION_TOKEN_PATTERNS.Comma],
          message: 'Expected comma or closing bracket following property',
        });
      }
    }

    const closeBrace = this.require({
      expected: [PUNCTUATION_TOKEN_PATTERNS.CloseBrace],
      message: 'Object literal missing closing brace',
    });

    return objectLiteralNode({
      properties,
      position: ExpressionPosition.from({
        start: openBrace,
        end: closeBrace,
      }),
    });
  }

  parseLogicalOrExpression(): PrimitiveExpression {
    let left: PrimitiveExpression = this.parseLogicalAndExpression();

    while (this.at().value === BinaryOperators.OR) {
      const operator = this.eat().value;
      const right = this.parseLogicalAndExpression();
      left = binaryExpressionNode({
        left,
        right,
        operator,
        position: ExpressionPosition.from({
          start: left,
          end: right,
        }),
      });
    }

    return left;
  }

  parseLogicalAndExpression(): PrimitiveExpression {
    let left: PrimitiveExpression = this.parseEqualityExpression();

    while (this.at().value === BinaryOperators.AND) {
      const operator = this.eat().value;
      const right = this.parseEqualityExpression();
      left = binaryExpressionNode({
        left,
        right,
        operator,
        position: ExpressionPosition.from({
          start: left,
          end: right,
        }),
      });
    }

    return left;
  }

  parseEqualityExpression(): PrimitiveExpression {
    let left: PrimitiveExpression = this.parseComparisonExpression();

    while (this.at().value === BinaryOperators.EQUALS) {
      const operator = this.eat().value;
      const right = this.parseComparisonExpression();
      left = binaryExpressionNode({
        left,
        right,
        operator,
        position: ExpressionPosition.from({
          start: left,
          end: right,
        }),
      });
    }

    return left;
  }

  parseComparisonExpression(): PrimitiveExpression {
    let left: PrimitiveExpression = this.parseAdditiveExpression();

    while (
      this.at().value === BinaryOperators.LESS_THAN ||
      this.at().value === BinaryOperators.GREATER_THAN
    ) {
      const operator = this.eat().value;
      const right = this.parseAdditiveExpression();
      left = binaryExpressionNode({
        left,
        right,
        operator,
        position: ExpressionPosition.from({
          start: left,
          end: right,
        }),
      });
    }

    return left;
  }

  parseAdditiveExpression(): PrimitiveExpression {
    let left: PrimitiveExpression = this.parseMultiplicitaveExpression();

    while (
      this.at().value === BinaryOperators.ADDITION ||
      this.at().value === BinaryOperators.SUBTRACTION
    ) {
      const operator = this.eat().value;
      const right = this.parseMultiplicitaveExpression();
      left = binaryExpressionNode({
        left,
        right,
        operator,
        position: ExpressionPosition.from({
          start: left,
          end: right,
        }),
      });
    }

    return left;
  }

  parseMultiplicitaveExpression(): PrimitiveExpression {
    let left: PrimitiveExpression = this.parseUnaryOperatorExpression();

    while (
      this.at().value === BinaryOperators.DIVISION ||
      this.at().value === BinaryOperators.MULTIPLICATION ||
      this.at().value === BinaryOperators.MODULUS
    ) {
      const operator = this.eat().value;
      const right = this.parseUnaryOperatorExpression();
      left = binaryExpressionNode({
        left,
        right,
        operator,
        position: ExpressionPosition.from({
          start: left,
          end: right,
        }),
      });
    }

    return left;
  }

  parseUnaryOperatorExpression(): PrimitiveExpression {
    const currentToken = this.at();
    if (
      currentToken.value === UnaryOperators.Not ||
      currentToken.value === UnaryOperators.Minus
    ) {
      const operator = this.eat();
      const unaryOperatorExpression = this.parseUnaryOperatorExpression();
      return unaryExpressionNode({
        operator: operator.value,
        argument: unaryOperatorExpression,
        position: ExpressionPosition.from({
          start: operator,
          end: unaryOperatorExpression,
        }),
      });
    }

    return this.parseCallMemberExpression();
  }

  // Parse member expressions with potential for consecutive call syntax (e.g., foo.bar()())
  parseCallMemberExpression(): PrimitiveExpression {
    const member = this.parseMemberExpression();

    if (this.at().type.name === TokenKind.OpenParen) {
      return this.parseCallExpression(member);
    }

    return member;
  }

  parseCallExpression(caller: PrimitiveExpression): PrimitiveExpression {
    const callExpressionArguments = this.parseArguments();

    let callExpression: PrimitiveExpression = callExpressionNode({
      caller,
      arguments: callExpressionArguments,
      position: ExpressionPosition.from({
        start: caller,
        end: this.at(),
      }),
    });

    if (this.at().type.name === TokenKind.OpenParen) {
      callExpression = this.parseCallExpression(callExpression);
    }

    return callExpression;
  }

  parseArguments(): PrimitiveExpression[] {
    this.require({
      expected: [PUNCTUATION_TOKEN_PATTERNS.OpenParen],
      message: 'Expected an opening parenthesis "(" to start the argument list',
    });

    const args =
      this.at().type.name === TokenKind.CloseParen
        ? []
        : this.parseArgumentsList();

    this.require({
      expected: [PUNCTUATION_TOKEN_PATTERNS.CloseParen],
      message: 'Missing closing parenthesis inside arguments list',
    });
    return args;
  }

  parseArgumentsList(): PrimitiveExpression[] {
    const args = [this.parsePrimitiveExpression()];

    while (this.at().type.name === TokenKind.Comma && this.eat()) {
      args.push(this.parsePrimitiveExpression());
    }

    return args;
  }

  parseMemberExpression(): PrimitiveExpression {
    let primaryExpression: PrimitiveExpression = this.parsePrimaryExpression();

    while (
      this.at().type.name === TokenKind.Dot ||
      this.at().type.name === TokenKind.OpenBracket
    ) {
      const operator = this.eat();
      let property: PrimitiveExpression;

      // Handle non-computed property access (e.g., obj.prop)
      if (operator.type.name === TokenKind.Dot) {
        // Parse RHS as identifier for dot notation
        property = this.parsePrimaryExpression();
        if (property.type !== ExpressionNodeType.Identifier) {
          this.throwError({
            message:
              'Cannonot use dot operator without right hand side being an identifier',
            position: property.position,
          });
        }
      } else {
        // Handle computed property access (e.g., obj[expr])
        property = this.parsePrimitiveExpression();
        this.require({
          expected: [PUNCTUATION_TOKEN_PATTERNS.CloseBracket],
          message:
            'Expected a closing bracket "]" to complete the computed property access',
        });
      }

      primaryExpression = memberExpressionNode({
        object: primaryExpression,
        property,
        position: ExpressionPosition.from({
          start: primaryExpression,
          end: property,
        }),
      });
    }

    return primaryExpression;
  }

  parsePrimaryExpression(): PrimitiveExpression {
    const token = this.at();
    switch (token.type.name) {
      case TokenKind.Identifier: {
        return identifierNode({ token: this.eat() });
      }
      case TokenKind.Number: {
        return numberLiteralNode({ token: this.eat() });
      }
      case TokenKind.String: {
        return stringLiteralNode({ token: this.eat() });
      }
      case TokenKind.True: {
        return trueLiteralNode({ token: this.eat() });
      }
      case TokenKind.False: {
        return falseLiteralNode({ token: this.eat() });
      }
      case TokenKind.Nil: {
        return nilLiteralNode({ token: this.eat() });
      }
      case TokenKind.OpenParen: {
        this.eat(); // eat opening parenthesis
        const value = this.parsePrimitiveExpression();
        this.require({
          expected: [PUNCTUATION_TOKEN_PATTERNS.CloseParen],
          message:
            'Expected a closing parenthesis ")" to match the opening parenthesis "("',
        });
        return value;
      }
      default: {
        this.throwError({
          message: 'Unexpected token found during parsing!',
          position: token.position,
        });
      }
    }
  }
}
