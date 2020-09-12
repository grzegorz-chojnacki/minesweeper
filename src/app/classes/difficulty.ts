export class Difficulty {
  public static readonly maxBoardDimension = 50;
  public readonly boardDimension: number;
  public readonly numberOfBombs: number;

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
  public static readonly custom: NamedDifficulty =
    { name: 'Custom', boardDimension: undefined, numberOfBombs: undefined };
  public static readonly presets: NamedDifficulty[] = [
    { name: 'Beginner',     boardDimension: 10, numberOfBombs: 10  },
    { name: 'Intermediate', boardDimension: 20, numberOfBombs: 50  },
    { name: 'Advanced',     boardDimension: 25, numberOfBombs: 120 },
    { name: 'Master',       boardDimension: 25, numberOfBombs: 180 }
  ];
  public static readonly initial = NamedDifficulty.presets[0];
  public readonly name: string;

  public static matchToPreset(difficulty: Difficulty): NamedDifficulty {
    return NamedDifficulty.presets.find(preset =>
      preset.boardDimension === difficulty.boardDimension &&
      preset.numberOfBombs === difficulty.numberOfBombs)
      || { ...difficulty, name: NamedDifficulty.custom.name };
  }

  constructor(name: string, boardDimension: number, numberOfBombs: number) {
    super(boardDimension, numberOfBombs);
    if (name.length > 0) {
      this.name = name;
    } else {
      throw new Error('Name is empty');
    }
  }
}
