import { Difficulty } from './difficulty';

describe('Difficulty', () => {
  it('should be created', () => {
    const bareDifficulty = new Difficulty(10, 10);
    expect(bareDifficulty).toBeTruthy();

    const namedDifficulty = new Difficulty(10, 10, 'Difficulty name');
    expect(namedDifficulty).toBeTruthy();
  });

  it('should throw error on wrong board dimension', () => {
    expect(() => new Difficulty( 0, 0)).toThrow();
    expect(() => new Difficulty(-1, 0)).toThrow();
    expect(() => new Difficulty( 1, 0)).not.toThrow();
  });

  it('should throw error on wrong number of bombs', () => {
    expect(() => new Difficulty(10,  -1)).toThrow();
    expect(() => new Difficulty(10, 100)).toThrow();
    expect(() => new Difficulty(10,   0)).not.toThrow();
    expect(() => new Difficulty(10,  99)).not.toThrow();
  });
});
