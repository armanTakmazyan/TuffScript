import { TokenType } from '../lexer/token/tokenType';
import { TokenKind } from '../lexer/token/types';
import { Token } from '../lexer/token/token';
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
  propertyNode,
  unaryExpressionNode,
} from '../ast/nodes';
import {
  UnaryOperators,
  BinaryOperators,
  IDENTIFIER_TOKEN_PATTERNS,
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
      this.throwError(
        `${message ? `${message}. ` : ''}At position ${
          this.position
        }, expected ${expected[0].name}. But got ${currentToken.value}`,
      );
    }
    return token;
  }

  throwError(message: string): never {
    throw new Error(message);
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
    this.eat(); // eat Function keyword
    const functionName = this.require({
      expected: [IDENTIFIER_TOKEN_PATTERNS.Identifier],
      message: 'Expected function name following "ֆունկցիա" keyword',
    }).value;

    const functionArguments = this.parseArguments().map(argument => {
      if (argument.type !== ExpressionNodeType.Identifier) {
        this.throwError(
          `Function parameter must be an identifier, found '${argument.type}' instead.`,
        );
      }
      return argument.symbol;
    });

    this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.Do],
      message: 'Expected function body following declaration',
    });

    const body: Expressions = [];

    while (!this.isEOF() && this.at().type.name !== TokenKind.End) {
      body.push(this.parseExpression());
    }

    this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.End],
      message:
        'Closing keyword "ավարտել" expected at the end of the function declaration',
    });

    const functionDeclaration = functionDeclarationNode({
      body,
      name: functionName,
      arguments: functionArguments,
    });

    return functionDeclaration;
  }

  parseAssignmentExpression(): AssignmentExpression {
    this.eat(); // eat Store keyword
    const primitiveExpression = this.parsePrimitiveExpression();

    const identifier = this.require({
      expected: [IDENTIFIER_TOKEN_PATTERNS.Identifier],
      message: 'Incorrect Assignment Format',
    }).value;

    const declaration: AssignmentExpression = assignmentExpressionNode({
      assigne: identifier,
      value: primitiveExpression,
    });

    this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.ContainmentSuffix],
      message:
        'Incorrect Assignment Format. Ensure the format: պահել <primitive_expression> <variable_name> ում',
    });

    return declaration;
  }

  parseIfExpression(): IfExpression {
    this.eat(); // eat If keyword
    const condition = this.parsePrimitiveExpression();
    this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.Do],
      message: 'Incorrect If Expression',
    });

    const thenBody: Expressions = [];

    while (!this.isEOF() && this.at().type.name !== TokenKind.Else) {
      thenBody.push(this.parseExpression());
    }

    this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.Else],
      message: 'Incorrect If Expression',
    });

    const elseBody: Expressions = [];

    while (!this.isEOF() && this.at().type.name !== TokenKind.End) {
      elseBody.push(this.parseExpression());
    }

    this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.End],
      message: 'Incorrect If Expression',
    });

    const ifExpression = ifExpressionNode({
      condition,
      thenBody,
      elseBody,
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

    this.eat(); // eat open brace
    const properties: Property[] = [];

    while (!this.isEOF() && this.at().type.name !== TokenKind.CloseBrace) {
      const key = this.require({
        expected: [IDENTIFIER_TOKEN_PATTERNS.Identifier],
        message: 'Object literal key expected',
      }).value;

      // Handle shorthand property notation in object literals (e.g., { key, })
      if (this.at().type.name === TokenKind.Comma) {
        this.eat(); // eat comma token

        properties.push(
          propertyNode({
            key,
          }),
        );
        continue;
      } else if (this.at().type.name === TokenKind.CloseBrace) {
        properties.push(
          propertyNode({
            key,
          }),
        );
        continue;
      }

      // Expect a colon after property key in object literal (e.g., { key: value })
      this.require({
        expected: [PUNCTUATION_TOKEN_PATTERNS.Colon],
        message: 'Missing colon following identifier in ObjectExpr',
      });

      const value = this.parsePrimitiveExpression();

      properties.push(
        propertyNode({
          key,
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

    this.require({
      expected: [PUNCTUATION_TOKEN_PATTERNS.CloseBrace],
      message: 'Object literal missing closing brace',
    });

    return objectLiteralNode({
      properties,
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
      const operator = this.eat().value;
      const unaryOperatorExpression = this.parseUnaryOperatorExpression();
      return unaryExpressionNode({
        operator,
        argument: unaryOperatorExpression,
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
    let callExpression: PrimitiveExpression = callExpressionNode({
      caller,
      arguments: this.parseArguments(),
    });

    if (this.at().type.name === TokenKind.OpenParen) {
      callExpression = this.parseCallExpression(callExpression);
    }

    return callExpression;
  }

  parseArguments(): PrimitiveExpression[] {
    this.require({
      expected: [PUNCTUATION_TOKEN_PATTERNS.OpenParen],
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
          this.throwError(
            'Cannonot use dot operator without right hand side being an identifier',
          );
        }
      } else {
        // Handle computed property access (e.g., obj[expr])
        property = this.parsePrimitiveExpression();
        this.require({ expected: [PUNCTUATION_TOKEN_PATTERNS.CloseBracket] });
      }

      primaryExpression = memberExpressionNode({
        object: primaryExpression,
        property,
      });
    }

    return primaryExpression;
  }

  parsePrimaryExpression(): PrimitiveExpression {
    const token = this.at();
    switch (token.type.name) {
      case TokenKind.Identifier: {
        return identifierNode({ symbol: this.eat().value });
      }
      case TokenKind.Number: {
        return numberLiteralNode({ value: parseFloat(this.eat().value) });
      }
      case TokenKind.String: {
        return stringLiteralNode({ value: this.eat().value });
      }
      case TokenKind.True: {
        this.eat();
        return trueLiteralNode();
      }
      case TokenKind.False: {
        this.eat();
        return falseLiteralNode();
      }
      case TokenKind.Nil: {
        this.eat();
        return nilLiteralNode();
      }
      case TokenKind.OpenParen: {
        this.eat(); // eat opening parenthesis
        const value = this.parsePrimitiveExpression();
        this.require({ expected: [PUNCTUATION_TOKEN_PATTERNS.CloseParen] });
        return value;
      }
      default: {
        this.throwError('Unexpected token found during parsing!');
      }
    }
  }
}
