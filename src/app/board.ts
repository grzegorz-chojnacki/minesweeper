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
        this.fields[y][x] = new Field(x, y);
      }
    }
  }

  // Debug method
  fieldsValues(): number[][] {
    return this.fields.map(row => row.map(field => field.getValue()));
  }

  showAll(): void {
    this.fields.forEach(row => row.forEach(field => field.check()));
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


  // Apply `fn` to all the fields around the field at given x, y point
  applyAround(field: Field, fn: (field: Field) => void): void {
    const getIndices = (n: number) => [n - 1, n, n + 1];
    const valid = (n: number) => (0 <= n && n < this.fields.length);
    const xIndices = getIndices(field.x).filter(valid);
    const yIndices = getIndices(field.y).filter(valid);

    yIndices.forEach(y => xIndices.forEach(x => {
      if (x !== field.x || y !== field.y) {
        fn(this.fields[y][x]);
      }
    }));
  }

  // Plant bombs on the board but avoid the first clicked field
  // We can simply shuffle the list of fields and put bombs on the first couple
  // of them (only the references are shuffled)
  plantBombs(firstClickedField: Field): void {
    const incrementValue = field => field.setValue(field.getValue() + 1);
    const fieldsFlatList = this.fields
      .reduce((acc, row) => acc.concat(row), [])
      .filter(field => field !== firstClickedField);

    this.shuffle(fieldsFlatList);

    fieldsFlatList.slice(0, this.numberOfBombs)
      .forEach(field => {
        field.setValue(Field.bomb);
        this.applyAround(field, incrementValue);
      });
    console.log(this.fieldsValues());
  }

}
