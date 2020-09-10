import { BombPlanter, FakeBombPlanter } from './bombPlanter';
import { Field } from './field';
import { Difficulty } from './difficulty';

describe('BombPlanter', () => {
  it('should not generate bomb on the first clicked field', () => {
    const boardDimension = 10;
    const numberOfBombs = 99;
    const difficulty = new Difficulty(boardDimension, numberOfBombs);
    const bombPlanter = new BombPlanter(difficulty);
    const fields = Field.makeMatrix(boardDimension);

    const clicked = fields[0][0];
    bombPlanter.plantBombs(clicked, fields);
    expect(clicked.value).not.toBe(Field.bomb);
  });

  it('should generate proprer number of bombs', () => {
    const boardDimension = 10;
    const numberOfBombs = 20;
    const difficulty = new Difficulty(boardDimension, numberOfBombs);
    const bombPlanter = new BombPlanter(difficulty);
    const fields = Field.makeMatrix(boardDimension);

    bombPlanter.plantBombs(null, fields);

    const bombsGenerated = fields
      .reduce((flat, nextRow) => flat.concat(nextRow), [])
      .filter(field => field.value === Field.bomb);

    expect(bombsGenerated.length).toBe(numberOfBombs);
  });
});

describe('FakeBombPlanter', () => {
  it('should throw error on empty template', () => {
    const template = [];
    expect(() => new FakeBombPlanter(template)).toThrow();
  });

  it('should throw error on not square template', () => {
    const template = [[' '], [' ']];
    expect(() => new FakeBombPlanter(template)).toThrow();
  });

  it('should generate proper number of bombs', () => {
    const template = [
      ['B', ' ', ' ', ' ', 'B'],
      [' ', 'B', ' ', ' ', 'B'],
      [' ', ' ', 'B', ' ', 'B'],
      [' ', ' ', ' ', 'B', 'B'],
      ['B', ' ', ' ', ' ', 'B']
    ];
    const numberOfBombs = 10;
    const bombPlanter = new FakeBombPlanter(template);
    const fields = Field.makeMatrix(template.length);

    bombPlanter.plantBombs(null, fields);

    const bombsGenerated = fields
      .reduce((flat, nextRow) => flat.concat(nextRow), [])
      .filter(field => field.value === Field.bomb);

    expect(bombsGenerated.length).toBe(numberOfBombs);
  });

  it('should plant bombs on proper fields', () => {
    const template = [
      ['B', 'B', ' '],
      [' ', 'B', 'B'],
      ['B', ' ', 'B']
    ];
    const bombCoords = [
      [0, 0], [1, 0], /*  */
      /*  */  [1, 1], [2, 1],
      [0, 2], /*  */, [2, 2]
    ];
    const bombPlanter = new FakeBombPlanter(template);
    const fields = Field.makeMatrix(template.length);

    bombPlanter.plantBombs(null, fields);

    bombCoords.forEach(coords => {
      const [x, y] = coords;
      expect(fields[y][x].value).toBe(Field.bomb);
    });
  });
});
