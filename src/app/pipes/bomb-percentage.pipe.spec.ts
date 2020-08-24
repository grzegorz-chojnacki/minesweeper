import { BombPercentagePipe } from './bomb-percentage.pipe';
import { Difficulty } from '../difficulty';

describe('BombPercentagePipe', () => {
  const pipe = new BombPercentagePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should output correct messages for nice numbers', () => {
    const difficulties = [
      { name: 'Test', boardDimension: 1, numberOfBombs: 1, result: 100 },
      { name: 'Test', boardDimension: 2, numberOfBombs: 0, result: 0 },
      { name: 'Test', boardDimension: 10, numberOfBombs: 10, result: 10 },
    ];

    difficulties.forEach(d => {
      expect(pipe.transform(d)).toBe(`About ${d.result}% of fields`);
    });
  });

  it('should output correct message for both bounds', () => {
    const bounds: Difficulty[] = [
      { name: 'Zero', boardDimension: 10, numberOfBombs: 0 },
      { name: 'Full', boardDimension: 10, numberOfBombs: 100 }
    ];

    expect(pipe.transform(bounds[0])).toBe('About 0% of fields');
    expect(pipe.transform(bounds[1])).toBe('About 100% of fields');
  });
});
