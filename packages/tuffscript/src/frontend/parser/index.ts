import { TokenType } from '../lexer/token/tokenType';
import { TokenKind } from '../lexer/token/types';
import { Token } from '../lexer/token/token';
import {
  Program,
  Statement,
  Expression,
  Property,
  Assignment,
  StatementOrExpression,
  ExpressionNodeType,
} from '../ast/types';
import {
  assignmentNode,
  binaryExpressionNode,
  callExpressionNode,
  functionDeclarationNode,
  identifierNode,
  memberExpressionNode,
  numberLiteralNode,
  stringLiteralNode,
  trueLiteralNode,
  falseLiteralNode,
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

// Orders Of Prescidence
// Assignment
// Object
// AdditiveExpr
// MultiplicitaveExpr
// Call
// Member
// PrimaryExpr

export interface ParserArgs {
  tokens: Token[];
}

export class Parser {
  scope: any = {};
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
    if (!token) {
      throw new Error(
        message ?? `At position ${this.position}, expected ${expected[0].name}`,
      );
    }
    return token;
  }

  throwError(message: string): never {
    console.error(this.at());
    throw new Error(message);
  }

  produceAST(): Program {
    const program: Program = {
      type: 'Program',
      body: [],
    };

    while (!this.isEOF()) {
      console.log('program', program);
      program.body.push(this.parseStatement());
      // this was here for the \n things
      // this.eat();
    }

    return program;
  }

  // Handle complex statement types
  parseStatement(): StatementOrExpression {
    // skip to parse_expr
    switch (this.at().type.name) {
      case TokenKind.Store:
        return this.parseVariableAssignment();
      case TokenKind.Function:
        return this.parseFunctionDeclaration();
      default:
        return this.parseExpression();
    }
    // const primaryExpression = this.parsePrimaryExpression();
    // const currentToken = this.at();
    // console.log('currentToken', currentToken);
    // if (
    //   currentToken.type.name !== TokenKind.Newline &&
    //   currentToken.type.name !== TokenKind.EOF
    // ) {
    //   this.throwError('Expected: end of statement!');
    // }

    // return primaryExpression;
  }

  parseFunctionDeclaration(): Statement {
    this.eat(); // eat Function keyword

    const functionName = this.require({
      expected: [IDENTIFIER_TOKEN_PATTERNS.Identifier],
      message: 'Expected function name following ֆունկցիա keyword',
    }).value;

    const functionArguments = this.parseArguments().map(argument => {
      // Note: It seems shoul work
      if (argument.type !== ExpressionNodeType.Identifier) {
        this.throwError(
          'Inside function declaration expected parameters to be of type string',
        );
      }
      return argument.symbol;
    });

    this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.Do],
      message: 'Expected function body following declaration',
    });

    const body: StatementOrExpression[] = [];

    while (!this.isEOF() && this.at().type.name !== TokenKind.End) {
      body.push(this.parseStatement());
    }

    this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.End],
      message: 'Closing brace expected inside function declaration',
    });

    const functionDeclaration = functionDeclarationNode({
      body,
      name: functionName,
      arguments: functionArguments,
    });

    return functionDeclaration;
  }

  // պահել 5 իմ_զանգվատս -ում
  parseVariableAssignment(): Statement {
    this.eat(); // eat Store keyword
    const primaryExpression = this.parseExpression();

    const identifier = this.require({
      expected: [IDENTIFIER_TOKEN_PATTERNS.Identifier],
      message: 'Incorrect Assignment Format. Expected identifier name',
    }).value;

    const declaration: Assignment = assignmentNode({
      assigne: identifier,
      value: primaryExpression,
    });

    this.require({
      expected: [KEYWORD_TOKEN_PATTERNS.ContainmentSuffix],
      message:
        'Incorrect Assignment Format. Ensure the format: պպահել <expression> <variable_name> ում',
    });

    return declaration;
  }

  // Handle expressions
  parseExpression(): Expression {
    return this.parseObjectExpression();
  }

  parseObjectExpression(): Expression {
    // { Prop[] }
    if (this.at().type.name !== TokenKind.OpenBrace) {
      return this.parseEqualityExpression();
    }

    this.eat(); // advance past open brace.
    const properties: Property[] = [];

    while (!this.isEOF() && this.at().type.name !== TokenKind.CloseBrace) {
      const key = this.require({
        expected: [IDENTIFIER_TOKEN_PATTERNS.Identifier],
        message: 'Object literal key expected',
      }).value;

      // Allows shorthand key: pair -> { key, }
      if (this.at().type.name == TokenKind.Comma) {
        this.eat(); // advance past comma

        properties.push(
          propertyNode({
            key,
          }),
        );
        continue;
      } // Allows shorthand key: pair -> { key }
      else if (this.at().type.name == TokenKind.CloseBrace) {
        properties.push(
          propertyNode({
            key,
          }),
        );
        continue;
      }

      // { key: val }
      this.require({
        expected: [PUNCTUATION_TOKEN_PATTERNS.Colon],
        message: 'Missing colon following identifier in ObjectExpr',
      });

      const value = this.parseExpression();

      properties.push(
        propertyNode({
          key,
          value,
        }),
      );

      if (this.at().type.name != TokenKind.CloseBrace) {
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

  parseEqualityExpression(): Expression {
    let left: Expression = this.parseComparisonExpression();

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

  parseComparisonExpression(): Expression {
    let left: Expression = this.parseAdditiveExpression();

    while (
      this.at().value == BinaryOperators.LESS_THAN ||
      this.at().value == BinaryOperators.GREATER_THAN
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

  // Handle Addition & Subtraction Operations
  parseAdditiveExpression(): Expression {
    let left: Expression = this.parseMultiplicitaveExpression();

    while (
      this.at().value == BinaryOperators.ADDITION ||
      this.at().value == BinaryOperators.SUBTRACTION
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

  // Handle Multiplication, Division & Modulo Operations
  parseMultiplicitaveExpression(): Expression {
    let left: Expression = this.parseCallMemberExpression();

    while (
      this.at().value === BinaryOperators.DIVISION ||
      this.at().value === BinaryOperators.MULTIPLICATION ||
      this.at().value === BinaryOperators.MODULUS
    ) {
      const operator = this.eat().value;
      const right = this.parseCallMemberExpression();
      left = binaryExpressionNode({
        left,
        right,
        operator,
      });
    }

    return left;
  }

  parseUnaryOperatorExpression(): Expression {
    if (this.at().value === UnaryOperators.Not) {
      const operator = this.eat().value;
      const unaryOperatorExpression = this.parseUnaryOperatorExpression();
      return unaryExpressionNode({
        operator,
        argument: unaryOperatorExpression,
      });
    }

    return this.parseCallMemberExpression();
  }

  // foo.bar()()
  parseCallMemberExpression(): Expression {
    const member = this.parseMemberExpression();

    if (this.at().type.name == TokenKind.OpenParen) {
      return this.parseCallExpression(member);
    }

    return member;
  }

  parseCallExpression(caller: Expression): Expression {
    let callExpression: Expression = callExpressionNode({
      caller,
      args: this.parseArguments(),
    });

    if (this.at().type.name == TokenKind.OpenParen) {
      callExpression = this.parseCallExpression(callExpression);
    }

    return callExpression;
  }

  parseArguments(): Expression[] {
    this.require({
      expected: [PUNCTUATION_TOKEN_PATTERNS.OpenParen],
    });
    const args =
      this.at().type.name == TokenKind.CloseParen
        ? []
        : this.parseArgumentsList();

    this.require({
      expected: [PUNCTUATION_TOKEN_PATTERNS.CloseParen],
      message: 'Missing closing parenthesis inside arguments list',
    });
    return args;
  }

  // Note: we do not have assignment expressions, only biding statements, so pass here the parseExpression()
  parseArgumentsList(): Expression[] {
    const args = [this.parseExpression()];

    while (this.at().type.name == TokenKind.Comma && this.eat()) {
      args.push(this.parseExpression());
    }

    return args;
  }

  parseMemberExpression(): Expression {
    let primaryExpression: Expression = this.parsePrimaryExpression();

    while (
      this.at().type.name === TokenKind.Dot ||
      this.at().type.name === TokenKind.OpenBracket
    ) {
      const operator = this.eat();
      let property: Expression;
      let computed: boolean;

      // non-computed values aka obj.expr
      console.log(
        'operator.type.name',
        operator.type.name,
        operator.type.name === TokenKind.Dot,
      );
      if (operator.type.name === TokenKind.Dot) {
        computed = false;
        // get identifier, interesting case, I think we will be able to write myObject.(some_property)
        property = this.parsePrimaryExpression();
        if (property.type !== ExpressionNodeType.Identifier) {
          this.throwError(
            'Cannonot use dot operator without right hand side being an identifier',
          );
        }
      } else {
        console.log('mtav ste');
        // this allows obj[computedValue]
        computed = true;
        // TODO: Change this parsePrimaryExpression, to parseExpression -this.parse_expr();
        property = this.parseExpression();
        this.require({ expected: [PUNCTUATION_TOKEN_PATTERNS.CloseBracket] });
      }

      primaryExpression = memberExpressionNode({
        object: primaryExpression,
        property,
        computed,
      });
    }

    return primaryExpression;
  }

  // Parse Literal Values & Grouping Expressions
  parsePrimaryExpression(): Expression {
    const token = this.at();
    switch (token.type.name) {
      case TokenKind.Identifier: {
        return identifierNode({ symbol: this.eat().value });
      }
      case TokenKind.Number: {
        return numberLiteralNode({ value: parseFloat(this.eat().value) });
      }
      case TokenKind.String: {
        return stringLiteralNode({ value: `${this.eat().value}` });
      }
      case TokenKind.True: {
        return trueLiteralNode({ value: `${this.eat().value}` });
      }
      case TokenKind.False: {
        return falseLiteralNode({ value: `${this.eat().value}` });
      }
      case TokenKind.OpenParen: {
        this.eat(); // eat the opening paren
        // const value = this.parse_expr();
        const value = this.parsePrimaryExpression();
        this.require({ expected: [PUNCTUATION_TOKEN_PATTERNS.CloseParen] });
        return value;
      }
      default: {
        this.throwError('Unexpected token found during parsing!');
      }
    }
  }
}
