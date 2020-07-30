import { Field } from './field';
import { Difficulty } from './difficulty';

export class Board {
  private _fields: Field[][];
  private numberOfBombs: number;
  private _flagCounter: number;

  constructor(difficulty: Difficulty) {
    this.numberOfBombs = this.flagCounter = difficulty.numberOfBombs;
    this._fields = this.newFields(difficulty.boardDimension);
  }

  public get fields(): Field[][] {
    return this._fields;
  }

  private newFields(boardDimension: number): Field[][] {
    const fields = new Array<Array<Field>>();
    for (let y = 0; y < boardDimension; y++) {
      fields[y] = new Array<Field>();
      for (let x = 0; x < boardDimension; x++) {
        fields[y][x] = new Field(x, y);
      }
    }
    return fields;
  }

  public checkAll(): void {
    this.fields.forEach(row => row.forEach(field => field.check()));
    this.flagCounter = 0;
  }

  // Shuffle array in place
  private shuffle(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
  }

  // Apply `fn` to all fields around `field`
  private applyAround(field: Field, fn: (field: Field) => void): void {
    const getIndices = (n: number) => [n - 1, n, n + 1];
    const valid = (n: number) => (0 <= n && n < this.fields.length);
    const xIndices = getIndices(field.x).filter(valid);
    const yIndices = getIndices(field.y).filter(valid);

    yIndices.forEach(y => xIndices.forEach(x => {
      if (!(x === field.x && y === field.y)) {
        fn(this.fields[y][x]);
      }
    }));
  }

  // Check `field` and if it has zero bombs around, then check every unchecked
  // field around it
  public checkNear(field: Field): void {
    if (field.isChecked) {
      return;
    }
    field.check();
    if (field.isFlagged) {
      field.toggleFlag();
      this.flagCounter++;
    }
    if (field.value === Field.clear) {
      this.applyAround(field, this.checkNear.bind(this));
    }
  }

  // Check win condition
  public countUncheckedFields(): number {
    return this.fields.reduce((acc, row) =>
      row.filter(field => !field.isChecked).length + acc, 0);
  }

  public get flagCounter(): number {
    return this._flagCounter;
  }

  public set flagCounter(value: number) {
    this._flagCounter = value;
  }

  // Toggle flag on `field` and update the flag counter
  public toggleFlag(field: Field): void {
    field.toggleFlag();
    this.flagCounter += (field.isFlagged) ? -1 : 1;
  }

  // Plant bombs on the board but avoid the first clicked field
  // Shuffle the list of fields references and plant bombs on as much
  // as `numberOfBombs` is
  public plantBombs(firstClickedField: Field): void {
    const incrementValue = (field: Field) => field.value++;
    const fieldsFlatList = this.fields
      .reduce((acc, row) => acc.concat(row), []) // flatten
      .filter(field => field !== firstClickedField);

    this.shuffle(fieldsFlatList);

    fieldsFlatList.slice(0, this.numberOfBombs)
      .forEach(field => {
        field.value = Field.bomb;
        this.applyAround(field, incrementValue);
      });
  }
}
