export class Field {
  private value = 0;
  private checked = false;
  private flagged = false;
  public readonly bomb = 9;

  constructor() { }

  getValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    this.value = value;
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
