export class FakeStorage implements Storage {
  private storage: {[key: string]: string} = {};
  public get length(): number {
    return Object.keys(this.storage).length;
  }
  public getItem(key: string): string {
    return (key in this.storage) ? this.storage[key] : null;
  }
  public setItem(key: string, value: string): void {
    this.storage[key] = value;
  }
  public key(index: number): string {
    return Object.keys(this.storage)[index];
  }
  public removeItem(key: string): void {
    delete this.storage[key];
  }
  public clear = () => {
    this.storage = {};
  }
}