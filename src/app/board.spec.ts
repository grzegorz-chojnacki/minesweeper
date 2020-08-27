import { Board } from './board';
import { Difficulty } from './difficulty';
import { Field } from './field';

interface ApplyBuilder<T> {
  on: (t: T[][]) => ApplyBuilder<T>;
  times: (n: number) => void;
}

// Do action on 'n' items from 2d array (from bottom right corner)
function apply<T>(action: (t: T) => void): ApplyBuilder<T> {
  let arr: T[][];
  const builder: ApplyBuilder<T> = {
    on: (ts: T[][]) => {
      arr = ts;
      return builder;
    },
    times: (n: number): void => {
      for (let y = arr.length - 1; y >= 0; y--) {
        for (let x = arr.length - 1; x >= 0; x--) {
          if (n > 0) {
            action(arr[y][x]);
            n--;
          } else { return; }
        }
      }
    }
  };
  return builder;
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
    const randomIndex = (length: number) =>
      Math.floor(Math.random() * length);
    const boardDimension = 10;
    const numberOfBombs = 10;

    // Try random couple of fields
    for (let i = 0; i < numberOfBombs; i++) {
      const board = new Board(new Difficulty(boardDimension, numberOfBombs));
      const [x, y] = [randomIndex(boardDimension), randomIndex(boardDimension)];

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
    const boardDimension = 10;
    const numberOfBombs = 10;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));

    const flagging = (field: Field) => board.toggleFlag(field);
    apply(flagging)
      .on(board.fields)
      .times(numberOfBombs);

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
    const boardDimension = 10;
    const numberOfBombs = 0;
    const board = new Board(new Difficulty(boardDimension, numberOfBombs));
    // spyOn(board, 'toggleFlag')
  });
  // it('should check all fields around clear field', () => {});
  // it('should check only one field if it has at least one bomb around', () => {});
  // it('should check all fields if the game was lost', () => {});
  // it('should return GameState.Continues after checking not-bomb field', () => {});
  // it('should return GameState.Won after checking all not-bomb fields', () => {});
  // it('should return GameState.Lost after checking bomb field', () => {});

});
