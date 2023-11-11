// -----------------------------------------------------------
// --------------          AST TYPES        ------------------
// ---     Defines the structure of our languages AST      ---
// -----------------------------------------------------------

export enum StatementNodeType {
  // STATEMENTS

  Assignment = 'Assignment',
  FunctionDeclaration = 'FunctionDeclaration',
}

export enum ExpressionNodeType {
  // EXPRESSIONS
  MemberExpression = 'MemberExpression',
  CallExpression = 'CallExpression',
  // Literals
  Property = 'Property',
  ObjectLiteral = 'ObjectLiteral',
  NumberLiteral = 'NumberLiteral',
  StringLiteral = 'StringLiteral',
  Identifier = 'Identifier',
  BinaryExpression = 'BinaryExpression',
}

//
// Statements do not result in a value at runtime.
// They contain one or more expressions internally

export interface BaseStatement {
  type: StatementNodeType;
}

export interface BaseExpression {
  type: ExpressionNodeType;
}

/**
 * Defines a block which contains many statements.
 * -  Only one program will be contained in a file.
 */

export interface Assignment extends BaseStatement {
  type: StatementNodeType.Assignment;
  assigne: string;
  value: Expression;
}

export interface FunctionDeclaration extends BaseStatement {
  type: StatementNodeType.FunctionDeclaration;
  arguments: string[];
  name: string;
  body: StatementOrExpression[];
}

export type Statement = Assignment | FunctionDeclaration;

/**  Expressions will result in a value at runtime unlike Statements */
/**
 * A operation with two sides seperated by a operator.
 * Both sides can be ANY Complex Expression.
 * - Supported Operators -> + | - | / | * | %
 */
export interface BinaryExpression extends BaseExpression {
  type: ExpressionNodeType.BinaryExpression;
  left: Expression;
  right: Expression;
  operator: string; // needs to be of type BinaryOperator
}

export interface CallExpression extends BaseExpression {
  type: ExpressionNodeType.CallExpression;
  args: Expression[];
  caller: Expression;
}

export interface MemberExpression extends BaseExpression {
  type: ExpressionNodeType.MemberExpression;
  object: Expression;
  property: Expression;
  computed: boolean;
}

// LITERAL / PRIMARY EXPRESSION TYPES
/**
 * Represents a user-defined variable or symbol in source.
 */
export interface Identifier extends BaseExpression {
  type: ExpressionNodeType.Identifier;
  symbol: string;
}

/**
 * Represents a numeric constant inside the soure code.
 */
export interface NumberLiteral extends BaseExpression {
  type: ExpressionNodeType.NumberLiteral;
  value: number;
}

export interface StringLiteral extends BaseExpression {
  type: ExpressionNodeType.StringLiteral;
  value: string;
}

export interface Property extends BaseExpression {
  type: ExpressionNodeType.Property;
  key: string;
  value?: Expression;
}

export interface ObjectLiteral extends BaseExpression {
  type: ExpressionNodeType.ObjectLiteral;
  properties: Property[];
}

export type Expression =
  | MemberExpression
  | CallExpression
  | Property
  | ObjectLiteral
  | NumberLiteral
  | StringLiteral
  | Identifier
  | BinaryExpression;

export type StatementOrExpression = Statement | Expression;

export interface Program {
  type: 'Program';
  body: StatementOrExpression[];
}
