import { BombPlanter } from 'src/app/classes/bombPlanter';
import { Difficulty } from 'src/app/classes/difficulty';
import { Field } from 'src/app/classes/field';

export enum GameState { Won, Lost, Continues }

export class Board {
  private _fields: Field[][];
  private _flagCounter: number;
  private difficulty: Difficulty;
  private isFirstClick = true;
  private uncheckedFieldCounter: number;

  get flagCounter(): number { return this._flagCounter; }

  get fields(): Field[][] { return this._fields; }

  constructor(private bombPlanter: BombPlanter) {
    this.difficulty = bombPlanter.difficulty;
    this.uncheckedFieldCounter = this.difficulty.boardDimension ** 2;
    this._flagCounter = this.difficulty.numberOfBombs;
    this._fields = this.newFields(this.difficulty.boardDimension);
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
    this._fields.forEach(row => row.forEach(field => field.check()));
    this._flagCounter = undefined;
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
      this._flagCounter++;
    }
    if (field.value === Field.clear) {
      field.applyAround(this._fields, this.checkNear.bind(this));
    }
  }

  public check(field: Field): GameState {
    if (this.isFirstClick) {
      this.bombPlanter.plantBombs(field, this.fields);
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
    if (this.uncheckedFieldCounter === this.difficulty.numberOfBombs) {
      this.checkAll();
      return GameState.Won;
    } else {
      return GameState.Continues;
    }
  }

  public toggleFlag(field: Field): void {
    if (this.flagCounter > 0 || field.isFlagged) {
      field.toggleFlag();
      this._flagCounter += (field.isFlagged) ? -1 : 1;
    }
  }
}
