export class Difficulty {
  name: string;
  boardDimension: number;
  numberOfBombs: number;
}

export const difficulties: Difficulty[] = [
  {
    name: 'Custom',
    boardDimension: undefined,
    numberOfBombs: undefined
  },
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
