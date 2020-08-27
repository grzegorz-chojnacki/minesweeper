export class Difficulty {
  public readonly name: string;
  public readonly boardDimension: number;
  public numberOfBombs: number;

  constructor(name: string, boardDimension: number, numberOfBombs: number) {
    if (boardDimension < 1) {
      throw new Error('Board dimension smaller than 1');
    } else if (numberOfBombs < 0) {
      throw new Error('Number of bombs smaller than 0');
    }
    this.name = name;
    this.boardDimension = boardDimension;
    this.numberOfBombs = numberOfBombs;
  }
}

// Special custom difficulty
export const customDifficulty: Difficulty = {
  name: 'Custom',
  boardDimension: undefined,
  numberOfBombs: undefined
};

// Difficulty presets
export const difficulties: Difficulty[] = [
  {
    name: 'Beginner',
    boardDimension: 10,
    numberOfBombs: 10
  },
  {
    name: 'Intermediate',
    boardDimension: 20,
    numberOfBombs: 50
  },
  {
    name: 'Advanced',
    boardDimension: 25,
    numberOfBombs: 120
  },
  {
    name: 'Master',
    boardDimension: 25,
    numberOfBombs: 180
  }
];
