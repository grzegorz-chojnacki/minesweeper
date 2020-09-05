export class Field {
  public static readonly bomb = 9;
  public static readonly clear = 0;
  public value = 0;
  private _checked = false;
  private _flagged = false;
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public get isChecked(): boolean {
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

  // Apply `fn` to all fields around this field in `fields` matrix
  public applyAround(fields: Field[][], fn: (field: Field) => void): void {
    const getNeighbours = (n: number) => [n - 1, n, n + 1];
    const valid = (n: number) => (0 <= n && n < fields.length);
    const xNeighbours = getNeighbours(this.x).filter(valid);
    const yNeighbours = getNeighbours(this.y).filter(valid);

    for (const y of yNeighbours) {
      for (const x of xNeighbours) {
        if (!(x === this.x && y === this.y)) {
          fn(fields[y][x]);
        }
      }
    }
  }
}
