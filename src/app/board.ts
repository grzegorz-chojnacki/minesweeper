import { Difficulty } from 'src/app/difficulty';
import { Field } from 'src/app/field';

export enum GameState { Won, Lost, Continues }

export class Board {
  private readonly numberOfBombs: number;
  private readonly _fields: Field[][];
  private isFirstClick = true;
  private _flagCounter: number;
  private _uncheckedFieldCounter: number;

  constructor(difficulty: Difficulty) {
    this.numberOfBombs = this.flagCounter = difficulty.numberOfBombs;
    this._uncheckedFieldCounter = difficulty.boardDimension ** 2;
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

  private checkAll(): void {
    this.fields.forEach(row => row.forEach(field => field.check()));
    this.flagCounter = undefined;
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

    for (const y of yIndices) {
      for (const x of xIndices) {
        if (!(x === field.x && y === field.y)) {
          fn(this.fields[y][x]);
        }
      }
    }
  }

  // Check `field` and if it has zero bombs around, then check every unchecked
  // field around it
  private checkNear(field: Field): void {
    if (field.isChecked) {
      return;
    }
    field.check();
    this.uncheckedFieldCounter--;
    if (field.isFlagged) {
      field.toggleFlag();
      this.flagCounter++;
    }
    if (field.value === Field.clear) {
      this.applyAround(field, this.checkNear.bind(this));
    }
  }

  public check(field: Field): GameState {
    if (this.isFirstClick) {
      this.plantBombs(field);
      this.isFirstClick = false;
    }

    if (field.isFlagged) {
      this.toggleFlag(field);
      return GameState.Continues;
    } else if (field.value === Field.bomb) {
      this.checkAll();
      return GameState.Lost;
    } else {
      this.checkNear(field);
    }
    // Win condition
    if (this._uncheckedFieldCounter === this.numberOfBombs) {
      this.checkAll();
      return GameState.Won;
    } else {
      return GameState.Continues;
    }
  }

  public get flagCounter(): number {
    return this._flagCounter;
  }

  public set flagCounter(value: number) {
    this._flagCounter = value;
  }

  public get uncheckedFieldCounter(): number {
    return this._uncheckedFieldCounter;
  }

  public set uncheckedFieldCounter(value: number) {
    this._uncheckedFieldCounter = value;
  }

  // Toggle flag on `field` and update the flag counter
  public toggleFlag(field: Field): void {
    if (this.flagCounter > 0 || field.isFlagged) {
      field.toggleFlag();
      this.flagCounter += (field.isFlagged) ? -1 : 1;
    }
  }

  // Plant bombs on the board but avoid the first clicked field
  // Shuffle the list of fields references and plant bombs on as much
  // as `numberOfBombs` is
  private plantBombs(firstClickedField: Field): void {
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
