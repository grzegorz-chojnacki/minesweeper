import { Field } from './field';
import { Difficulty } from './difficulty';

export class Board {
  private fields: Field[][];
  private numberOfBombs: number;
  private flags: number;

  constructor(difficulty: Difficulty) {
    this.numberOfBombs = this.flags = difficulty.numberOfBombs;
    this.initBoard(difficulty.boardDimension);
  }

  initBoard(boardDimension: number): void {
    this.fields = new Array<Array<Field>>();
    for (let y = 0; y < boardDimension; y++) {
      this.fields[y] = new Array<Field>();
      for (let x = 0; x < boardDimension; x++) {
        this.fields[y][x] = new Field();
      }
    }
  }

  getFields(): Field[][] {
    return this.fields;
  }
}
