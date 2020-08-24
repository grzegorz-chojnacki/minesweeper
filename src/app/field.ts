export class Field {
  public static readonly bomb = 9;
  public static readonly clear = 0;
  private _value = 0;
  private _checked = false;
  private _flagged = false;
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // Limit value between 0 and 9
  public set value(value: number) {
    if (0 <= value && value <= 9) {
      this._value = value;
    }
  }

  public get value(): number {
    return this._value;
  }

  public isChecked(): boolean {
    return this._checked;
  }

  public check(): void {
   this._checked = true;
  }

  public get isFlagged(): boolean {
    return this._flagged;
  }

  public toggleFlag(): void {
    this._flagged = !this._flagged;
  }
}
