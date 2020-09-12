import { Board, GameState } from './board';
import { BombPlanter, FakeBombPlanter } from 'src/app/classes/bombPlanter';
import { Difficulty } from 'src/app/classes/difficulty';

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

function newRandomBoard(boardDimension: number, numberOfBombs: number): Board {
  const difficulty = new Difficulty(boardDimension, numberOfBombs);
  const bombPlanter = new BombPlanter(difficulty);
  return new Board(bombPlanter);
}

function newMockedBoard(template: string[][]): Board {
  const bombPlanter = new FakeBombPlanter(template);
  return new Board(bombPlanter);
}

describe('Board', () => {
  describe('Initialization behaviour', () => {
    it('should be created', () => {
      const boardDimension = 10;
      const numberOfBombs = 10;
      const board = newRandomBoard(boardDimension, numberOfBombs);

      expect(board).toBeTruthy();
    });

    it('should have proper number of flags set', () => {
      const boardDimension = 10;
      const numberOfBombs = 10;
      const board = newRandomBoard(boardDimension, numberOfBombs);

      expect(board.flagCounter).toBe(numberOfBombs);
    });
  });

  describe('Check behaviour', () => {
    it('should plant bombs only on the first click', () => {
      const template = [
        [' ', ' ', 'B'],
        [' ', 'B', 'B'],
        [' ', ' ', ' ']
      ];
      const bombPlanter = new FakeBombPlanter(template);
      spyOn(bombPlanter, 'plantBombs').and.callThrough();
      const board = new Board(bombPlanter);

      let clicked = board.fields[0][0];
      board.check(clicked);
      expect(bombPlanter.plantBombs).toHaveBeenCalledTimes(1);

      clicked = board.fields[0][1];
      board.check(clicked);
      expect(bombPlanter.plantBombs).toHaveBeenCalledTimes(1);
    });

    it('should remove flags from fields if they were checked', () => {
      const template = [
        [' ', ' ', ' ', 'B ', 'B'],
        [' ', ' ', ' ', 'B ', 'B'],
        [' ', ' ', ' ', 'B ', ' '],
        ['F', 'F', ' ', 'B ', ' '],
        ['F', 'F', 'F', 'BF', 'F']
      ];
      const board = newMockedBoard(template);

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
      const board = newMockedBoard(template);

      const clicked = board.fields[1][1];
      board.check(clicked);

      const checkedFields = board.fields
        .reduce((flat, nextRow) => flat.concat(nextRow), [])
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
      const board = newMockedBoard(template);

      const clicked = board.fields[0][0];
      board.check(clicked);

      const checkedFields = board.fields
        .reduce((flat, nextRow) => flat.concat(nextRow), [])
        .filter(field => field.isChecked)
        .length;

      expect(checkedFields).toBe(1);
    });
  });

  describe('Flagging behaviour', () => {
    it('should toggle flag on a field', () => {
      const boardDimension = 10;
      const numberOfBombs = 10;
      const board = newRandomBoard(boardDimension, numberOfBombs);
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
      const board = newRandomBoard(boardDimension, numberOfBombs);
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
      const board = newRandomBoard(boardDimension, numberOfBombs);
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
        .reduce((flat, nextRow) => flat.concat(nextRow), [])
        .length;

      expect(numberOfFlaggedFields).toBe(numberOfBombs);
      expect(board.flagCounter).not.toBeLessThan(0);
    });
  });

  describe('Game state behaviour', () => {
    it('should check all fields if the game was lost', () => {
      const template = [
        [' ', ' ', ' '],
        [' ', 'B', ' '],
        [' ', ' ', ' ']
      ];
      const board = newMockedBoard(template);

      const clicked = board.fields[1][1];
      board.check(clicked);

      const checkedFields = board.fields
        .reduce((flat, nextRow) => flat.concat(nextRow), [])
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
      const board = newMockedBoard(template);

      const clicked = board.fields[0][0];
      const gameState = board.check(clicked);

      expect(gameState).toBe(GameState.Continues);
    });

    it('should return GameState.Continues after checking flagged field', () => {
      const board = newRandomBoard(1, 0);

      const flagged = board.fields[0][0];
      flagged.toggleFlag();
      const gameState = board.check(flagged);

      expect(gameState).toBe(GameState.Continues);
    });

    it('should return GameState.Won after checking all not-bomb fields', () => {
      const template = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', 'B']
      ];
      const board = newMockedBoard(template);

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
      const board = newMockedBoard(template);

      const clicked = board.fields[0][0];
      const gameState = board.check(clicked);

      expect(gameState).toBe(GameState.Lost);
    });
  });
});
