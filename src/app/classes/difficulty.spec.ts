import { Difficulty, NamedDifficulty } from './difficulty';

describe('Difficulty', () => {
  it('should be created', () => {
    const difficulty = new Difficulty(10, 10);
    expect(difficulty).toBeTruthy();
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

describe('NamedDifficulty', () => {
  it('should be created', () => {
    const namedDifficulty = new NamedDifficulty('Name', 10, 10);
    expect(namedDifficulty).toBeTruthy();
  });

  it('should throw error on null name', () => {
    expect(() => new NamedDifficulty(null, 10, 10)).toThrow();
  });

  it('should throw error on undefined name', () => {
    expect(() => new NamedDifficulty(undefined, 10, 10)).toThrow();
  });

  it('should throw error on empty name', () => {
    expect(() => new NamedDifficulty('', 10, 10)).toThrow();
  });
});
