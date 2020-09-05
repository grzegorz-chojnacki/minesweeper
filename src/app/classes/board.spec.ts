import { Board, GameState } from './board';
import { BombPlanter, FakeBombPlanter } from 'src/app/classes/bombPlanter';
import { Difficulty } from 'src/app/classes/difficulty';
import { Field } from 'src/app/classes/field';

interface UsingTemplate {
  usingTemplate(template: string[][]): void;
}

function flag(board: Board): UsingTemplate {
  return {
    usingTemplate: (template: string[][]) => {
      for (let y = 0; y < template.length; y++) {
        for (let x = 0; x < template.length; x++) {
          if (template[y][x].includes('F')) {
            board.toggleFlag(board.fields[y][x]);
          }
        }
      }
    }
  };
}

function getRandomBoard(boardDimension: number, numberOfBombs: number): Board {
  const difficulty = new Difficulty(boardDimension, numberOfBombs);
  const bombPlanter = new BombPlanter(difficulty);
  return new Board(bombPlanter);
}

function getMockedBoard(template: string[][]): Board {
  const bombPlanter = new FakeBombPlanter(template);
  return new Board(bombPlanter);
}

describe('Board', () => {
  it('should be created', () => {
    const boardDimension = 10;
    const numberOfBombs = 10;
    const board = getRandomBoard(boardDimension, numberOfBombs);

    expect(board).toBeTruthy();
  });

  it('should create proper fields array', () => {
    const boardDimension = 10;
    const numberOfBombs = 10;
    const board = getRandomBoard(boardDimension, numberOfBombs);

    expect(board.fields.length).toBe(boardDimension);
    expect(board.fields[0].length).toBe(boardDimension);
  });

  it('should not generate bomb on the first clicked field', () => {
    const boardDimension = 10;
    const numberOfBombs = 10;
    const clickCases = [
      [0, 0],
      [0, boardDimension - 1],
      [boardDimension - 1, 0],
      [boardDimension - 1, boardDimension - 1],
      [Math.floor(boardDimension / 2), Math.floor(boardDimension / 2)]
    ];

    for (const clickCase of clickCases) {
      const board = getRandomBoard(boardDimension, numberOfBombs);
      const [x, y] = clickCase;

      const clicked = board.fields[y][x];
      board.check(clicked); // Plant bombs
      expect(clicked.value).not.toBe(Field.bomb);
    }
  });

  it('should have proper number of bombs generated', () => {
    const isBomb = (field: Field) => field.value === Field.bomb;
    const boardDimension = 10;
    const numberOfBombs = 10;
    const board = getRandomBoard(boardDimension, numberOfBombs);
    const clicked = board.fields[0][0];

    board.check(clicked); // Plant bombs
    const bombsGenerated = board.fields
      .map(row => row.filter(isBomb))
      .reduce((acc, arr) => acc.concat(arr), []);

    expect(bombsGenerated.length).toBe(numberOfBombs);
  });

  it('should have proper number of flags set', () => {
    const boardDimension = 10;
    const numberOfBombs = 10;
    const board = getRandomBoard(boardDimension, numberOfBombs);

    expect(board.flagCounter).toBe(numberOfBombs);
  });

  it('should toggle flag on a field', () => {
    const boardDimension = 10;
    const numberOfBombs = 10;
    const board = getRandomBoard(boardDimension, numberOfBombs);
    const clicked = board.fields[0][0];

    expect(clicked.isFlagged).toBe(false);
    board.toggleFlag(clicked);
    expect(clicked.isFlagged).toBe(true);
    board.toggleFlag(clicked);
    expect(clicked.isFlagged).toBe(false);
  });

  it('should update flag counter', () => {
    const boardDimension = 10;
    const numberOfBombs = 10;
    const board = getRandomBoard(boardDimension, numberOfBombs);
    const clicked = board.fields[0][0];

    expect(board.flagCounter).toBe(numberOfBombs);
    board.toggleFlag(clicked);
    expect(board.flagCounter).toBe(numberOfBombs - 1);
    board.toggleFlag(clicked);
    expect(board.flagCounter).toBe(numberOfBombs);
  });

  it('should not let flag another field if there are no flags left', () => {
    const boardDimension = 5;
    const numberOfBombs = 5;
    const board = getRandomBoard(boardDimension, numberOfBombs);
    const flagTemplate = [
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      ['F', 'F', 'F', 'F', 'F']
    ];

    flag(board).usingTemplate(flagTemplate);

    expect(board.flagCounter).toBe(0);
    board.toggleFlag(board.fields[0][0]);
    const numberOfFlaggedFields = board.fields
      .map(row => row.filter(field => field.isFlagged))
      .reduce((acc, arr) => acc.concat(arr), [])
      .length;

    expect(numberOfFlaggedFields).toBe(numberOfBombs);
    expect(board.flagCounter).not.toBeLessThan(0);
  });

  it('should remove flags from fields if they were checked', () => {
    const template = [
      [' ', ' ', ' ', 'B ', 'B'],
      [' ', ' ', ' ', 'B ', 'B'],
      [' ', ' ', ' ', 'B ', ' '],
      ['F', 'F', ' ', 'B ', ' '],
      ['F', 'F', 'F', 'BF', 'F']
    ];
    const board = getMockedBoard(template);

    flag(board).usingTemplate(template);
    const clicked = board.fields[0][0];
    board.check(clicked);

    expect(board.flagCounter).toBe(5);
  });

  it('should check all fields around clear field', () => {
    const template = [
      [' ', ' ', ' ', 'B', ' '],
      [' ', ' ', ' ', 'B', ' '],
      [' ', ' ', ' ', 'B', ' '],
      ['B', 'B', 'B', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ']
    ];
    const board = getMockedBoard(template);

    const clicked = board.fields[1][1];
    board.check(clicked);

    const checkedFields = board.fields
      .reduce((acc, row) => acc.concat(row))
      .filter(field => field.isChecked)
      .length;

    expect(checkedFields).toBe(9);
  });

  it('should check only one field if it has at least one bomb around', () => {
    const template = [
      [' ', ' ', ' '],
      [' ', 'B', ' '],
      [' ', ' ', ' ']
    ];
    const board = getMockedBoard(template);

    const clicked = board.fields[0][0];
    board.check(clicked);

    const checkedFields = board.fields
      .reduce((acc, row) => acc.concat(row))
      .filter(field => field.isChecked)
      .length;

    expect(checkedFields).toBe(1);
  });

  it('should check all fields if the game was lost', () => {
    const template = [
      [' ', ' ', ' '],
      [' ', 'B', ' '],
      [' ', ' ', ' ']
    ];
    const board = getMockedBoard(template);

    const clicked = board.fields[1][1];
    board.check(clicked);

    const checkedFields = board.fields
      .reduce((acc, row) => acc.concat(row))
      .filter(field => field.isChecked)
      .length;

    expect(checkedFields).toBe(template.length ** 2);
  });

  it('should return GameState.Continues after checking not-bomb field', () => {
    const template = [
      [' ', 'B', ' '],
      ['B', 'B', ' '],
      [' ', ' ', ' ']
    ];
    const board = getMockedBoard(template);

    const clicked = board.fields[0][0];
    const gameState = board.check(clicked);

    expect(gameState).toBe(GameState.Continues);
  });

  it('should return GameState.Won after checking all not-bomb fields', () => {
    const template = [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', 'B']
    ];
    const board = getMockedBoard(template);

    const clicked = board.fields[0][0];
    const gameState = board.check(clicked);

    expect(gameState).toBe(GameState.Won);
  });

  it('should return GameState.Lost after checking bomb field', () => {
    const template = [
      ['B', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' ']
    ];
    const board = getMockedBoard(template);

    const clicked = board.fields[0][0];
    const gameState = board.check(clicked);

    expect(gameState).toBe(GameState.Lost);
  });

});
