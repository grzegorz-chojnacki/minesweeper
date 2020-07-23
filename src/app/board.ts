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

  getFields(): Field[][] {
    return this.fields;
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

  fieldsValues(): number[][] {
    return this.fields.map(row => row.map(field => field.getValue()));
  }

  // Shuffle array in place
  shuffle(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
  }

  // Plant bombs on the board but avoid the first clicked field
  // We can simply shuffle the list of fields and put bombs on the first couple
  // of them (only the references are shuffled)
  plantBombs(firstClickedField: Field): void {
    const fieldsFlatList = this.fields
      .reduce((acc, row) => acc.concat(row), [])
      .filter(field => field !== firstClickedField);

    this.shuffle(fieldsFlatList);

    fieldsFlatList.slice(0, this.numberOfBombs)
      .forEach(field => field.setValue(field.bomb));
  }

}
