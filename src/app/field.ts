export class Field {
  public static bomb = 9;
  private value = 0;
  private checked = false;
  private flagged = false;
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getValue(): number {
    return this.value;
  }

  // Cap maximum value at 9
  setValue(value: number): void {
    if (value <= 9) {
      this.value = value;
    }
  }

  isChecked(): boolean {
    return this.checked;
  }

  check(): void {
   this.checked = true;
  }

  isFlagged(): boolean {
    return this.flagged;
  }

  toggleFlag(): void {
    this.flagged = !this.flagged;
  }
}
