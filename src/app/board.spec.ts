import { Board, GameState } from './board';
import { Difficulty } from './difficulty';
import { Field } from './field';

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

describe('Board', () => {
  it('should be created', () => {
    const boardDimension = 10;
    const numberOfBombs = 10;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));

    expect(board).toBeTruthy();
  });

  it('should create proper fields array', () => {
    const boardDimension = 10;
    const numberOfBombs = 10;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));

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
      const board = new Board(new Difficulty(boardDimension, numberOfBombs));
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
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));
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
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));

    expect(board.getFlagCounter()).toBe(numberOfBombs);
  });

  it('should toggle flag on a field', () => {
    const boardDimension = 10;
    const numberOfBombs = 10;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));
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
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));
    const clicked = board.fields[0][0];

    expect(board.getFlagCounter()).toBe(numberOfBombs);
    board.toggleFlag(clicked);
    expect(board.getFlagCounter()).toBe(numberOfBombs - 1);
    board.toggleFlag(clicked);
    expect(board.getFlagCounter()).toBe(numberOfBombs);
  });

  it('should not let flag another field if there are no flags left', () => {
    const boardDimension = 5;
    const numberOfBombs = 5;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));
    const flagTemplate = [
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' '],
      ['F', 'F', 'F', 'F', 'F']
    ];

    flag(board).usingTemplate(flagTemplate);

    expect(board.getFlagCounter()).toBe(0);
    board.toggleFlag(board.fields[0][0]);
    const numberOfFlaggedFields = board.fields
      .map(row => row.filter(field => field.isFlagged))
      .reduce((acc, arr) => acc.concat(arr), [])
      .length;

    expect(numberOfFlaggedFields).toBe(numberOfBombs);
    expect(board.getFlagCounter()).not.toBeLessThan(0);
  });

  it('should remove flags from fields if they were checked', () => {
    const boardDimension = 5;
    const numberOfBombs = 7;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));
    const template = [
      [' ', ' ', ' ', 'B ', 'B'],
      [' ', ' ', ' ', 'B ', 'B'],
      [' ', ' ', ' ', 'B ', ' '],
      ['F', 'F', ' ', 'B ', ' '],
      ['F', 'F', 'F', 'BF', 'F']
    ];

    board.fromTemplate(template);
    flag(board).usingTemplate(template);
    const clicked = board.fields[0][0];
    board.check(clicked);

    expect(board.getFlagCounter()).toBe(5);
  });

  it('should check all fields around clear field', () => {
    const boardDimension = 5;
    const numberOfBombs = 6;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));
    const template = [
      [' ', ' ', ' ', 'B', ' '],
      [' ', ' ', ' ', 'B', ' '],
      [' ', ' ', ' ', 'B', ' '],
      ['B', 'B', 'B', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ']
    ];

    board.fromTemplate(template);
    const clicked = board.fields[1][1];
    board.check(clicked);

    const checkedFields = board.fields
      .reduce((acc, row) => acc.concat(row))
      .filter(field => field.isChecked)
      .length;

    expect(checkedFields).toBe(9);
  });

  it('should check only one field if it has at least one bomb around', () => {
    const boardDimension = 3;
    const numberOfBombs = 1;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));
    const template = [
      [' ', ' ', ' '],
      [' ', 'B', ' '],
      [' ', ' ', ' ']
    ];

    board.fromTemplate(template);
    const clicked = board.fields[0][0];
    board.check(clicked);

    const checkedFields = board.fields
      .reduce((acc, row) => acc.concat(row))
      .filter(field => field.isChecked)
      .length;

    expect(checkedFields).toBe(1);
  });

  it('should check all fields if the game was lost', () => {
    const boardDimension = 3;
    const numberOfBombs = 1;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));
    const template = [
      [' ', ' ', ' '],
      [' ', 'B', ' '],
      [' ', ' ', ' ']
    ];

    board.fromTemplate(template);
    const clicked = board.fields[1][1];
    board.check(clicked);

    const checkedFields = board.fields
      .reduce((acc, row) => acc.concat(row))
      .filter(field => field.isChecked)
      .length;

    expect(checkedFields).toBe(boardDimension ** 2);
  });

  it('should return GameState.Continues after checking not-bomb field', () => {
    const boardDimension = 3;
    const numberOfBombs = 1;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));
    const template = [
      [' ', 'B', ' '],
      ['B', 'B', ' '],
      [' ', ' ', ' ']
    ];

    board.fromTemplate(template);
    const clicked = board.fields[0][0];
    const gameState = board.check(clicked);

    expect(gameState).toBe(GameState.Continues);
  });

  it('should return GameState.Won after checking all not-bomb fields', () => {
    const boardDimension = 3;
    const numberOfBombs = 1;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));
    const template = [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', 'B']
    ];

    board.fromTemplate(template);
    const clicked = board.fields[0][0];
    const gameState = board.check(clicked);

    expect(gameState).toBe(GameState.Won);
  });

  it('should return GameState.Lost after checking bomb field', () => {
    const boardDimension = 3;
    const numberOfBombs = 1;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));
    const template = [
      ['B', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' ']
    ];

    board.fromTemplate(template);
    const clicked = board.fields[0][0];
    const gameState = board.check(clicked);

    expect(gameState).toBe(GameState.Lost);
  });

});
