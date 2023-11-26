import { Position } from '../../lexer/token/types';

export interface PositionedElement {
  position: Position;
}

export type ExpressionPositionArgs = Position | PositionedElement;

export interface FromArgs {
  start: PositionedElement;
  end: PositionedElement;
}

export interface FromTokenArgs {
  token: PositionedElement;
}

export interface MergeArgs {
  otherExpression: PositionedElement;
}
