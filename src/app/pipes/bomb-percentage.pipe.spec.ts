import { BombPercentagePipe } from './bomb-percentage.pipe';
import { Difficulty } from 'src/app/classes/difficulty';

describe('BombPercentagePipe', () => {
  it('should create an instance', () => {
    const pipe = new BombPercentagePipe();

    expect(pipe).toBeTruthy();
  });

  it('should output correct message for passed difficulty', () => {
    const pipe = new BombPercentagePipe();
    const difficulty: Difficulty =
      { name: '', boardDimension: 10, numberOfBombs: 10 };

    expect(pipe.transform(difficulty)).toContain('10%');
  });

  it('should output correct message for both bounds', () => {
    const pipe = new BombPercentagePipe();
    const bounds: Difficulty[] = [
      { name: '', boardDimension: 10, numberOfBombs:   0 },
      { name: '', boardDimension: 10, numberOfBombs: 100 }
    ];

    expect(pipe.transform(bounds[0])).toContain('0%');
    expect(pipe.transform(bounds[1])).toContain('100%');
  });

  it('should handle division by zero', () => {
    const pipe = new BombPercentagePipe();
    const difficulty: Difficulty =
      { name: '', boardDimension: 0, numberOfBombs: 100 };

    expect(pipe.transform(difficulty)).toBe('');
  });

  it('should handle negative numbers', () => {
    const pipe = new BombPercentagePipe();
    const negatives: Difficulty[] = [
      { name: '', boardDimension: -10, numberOfBombs:  10 },
      { name: '', boardDimension:  10, numberOfBombs: -10 },
      { name: '', boardDimension: -10, numberOfBombs: -10 }
    ];

    expect(pipe.transform(negatives[0])).toBe('');
    expect(pipe.transform(negatives[1])).toBe('');
    expect(pipe.transform(negatives[2])).toBe('');
  });

  it('should output message with rounded percentage', () => {
    const pipe = new BombPercentagePipe();
    const difficulty: Difficulty =
      { name: '', boardDimension: 7, numberOfBombs: 7 };

    expect(pipe.transform(difficulty)).toContain('14%');
  });
});
