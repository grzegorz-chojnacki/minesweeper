export class Difficulty {
  public static readonly maxBoardDimension = 50;
  public readonly boardDimension: number;
  public readonly numberOfBombs: number;

  public static matchToPreset(difficulty: Difficulty): NamedDifficulty {
    return difficulties.find(preset =>
        preset.boardDimension === difficulty.boardDimension &&
        preset.numberOfBombs  === difficulty.numberOfBombs)
    || {...difficulty, name: customDifficulty.name };
  }

  constructor(boardDimension: number, numberOfBombs: number) {
    if (boardDimension < 1) {
      throw new Error('Board dimension smaller than 1');
    } else if (numberOfBombs < 0) {
      throw new Error('Number of bombs smaller than 0');
    } else if (numberOfBombs > boardDimension ** 2 - 1) {
      throw new Error('Number of bombs is greater than number of available fields');
    }
    this.boardDimension = boardDimension;
    this.numberOfBombs = numberOfBombs;
  }
}

export class NamedDifficulty extends Difficulty {
  public readonly name: string;

  constructor(name: string, boardDimension: number, numberOfBombs: number) {
    super(boardDimension, numberOfBombs);
    if (name.length > 0) {
      this.name = name;
    } else {
      throw new Error('Name is empty');
    }
  }
}

// Special custom difficulty
export const customDifficulty: NamedDifficulty = {
  name: 'Custom',
  boardDimension: undefined,
  numberOfBombs: undefined
};

// Difficulty presets
export const difficulties: NamedDifficulty[] = [
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
