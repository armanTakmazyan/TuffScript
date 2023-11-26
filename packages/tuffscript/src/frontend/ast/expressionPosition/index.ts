import { Position } from '../../lexer/token/types';
import {
  FromArgs,
  MergeArgs,
  FromTokenArgs,
  ExpressionPositionArgs,
} from './types';

export class ExpressionPosition implements Position {
  start: number;
  end: number;

  constructor(expression: ExpressionPositionArgs) {
    if ('start' in expression && 'end' in expression) {
      // Initialize using Position
      this.start = expression.start;
      this.end = expression.end;
    } else {
      // Initialize using Token
      this.start = expression.position.start;
      this.end = expression.position.end;
    }

    this.validatePosition();
  }

  private validatePosition(): void {
    if (this.start > this.end) {
      throw new Error('Start position cannot be greater than end position');
    }
  }

  static from({ start, end }: FromArgs): ExpressionPosition {
    return new ExpressionPosition({
      start: start.position.start,
      end: end.position.end,
    });
  }

  static fromToken({ token }: FromTokenArgs): ExpressionPosition {
    return new ExpressionPosition(token);
  }

  merge({ otherExpression }: MergeArgs): ExpressionPosition {
    return new ExpressionPosition({
      start: Math.min(this.start, otherExpression.position.start),
      end: Math.max(this.end, otherExpression.position.end),
    });
  }
}
