export class Difficulty {
  public readonly name: string;
  public readonly boardDimension: number;
  public numberOfBombs: number;

  constructor(name: string, boardDimension: number, numberOfBombs: number) {
    this.name = name;
    this.boardDimension = boardDimension;
    this.numberOfBombs = numberOfBombs;
  }
}

// Mutable custom difficulty
export const customDifficulty = {
  name: 'Custom',
  boardDimension: undefined,
  numberOfBombs: undefined
};

// Immutable difficulty presets
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
