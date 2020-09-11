import { DifficultyService } from './difficulty.service';
import { Difficulty, difficulties } from 'src/app/classes/difficulty';

class FakeStorage implements Storage {
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

function serviceWithEmptyStorage(): DifficultyService {
  return new DifficultyService(new FakeStorage());
}

describe('DifficultyService', () => {
  it('should be created', () => {
    const service = serviceWithEmptyStorage();
    expect(service).toBeTruthy();
  });

  it('should initialize when local storage is empty', () => {
    const service = serviceWithEmptyStorage();

    let result: Difficulty;
    service.difficulty.subscribe(difficulty => result = difficulty)
      .unsubscribe();

    expect(result).toBe(difficulties[0]);
  });

  it('should load data when local storage is not empty', () => {
    const newDifficulty = new Difficulty(5, 5);
    const storage = new FakeStorage();
    storage.setItem('difficulty', JSON.stringify(newDifficulty));

    const service = new DifficultyService(storage);

    let result: Difficulty;
    service.difficulty.subscribe(difficulty => result = difficulty)
      .unsubscribe();

    expect({...result}).toEqual({...newDifficulty});
  });

  it('should set and update new difficulty value', () => {
    const service = serviceWithEmptyStorage();
    const newDifficulty = new Difficulty(5, 5);

    service.newDifficulty(newDifficulty);

    let result: Difficulty;
    service.difficulty.subscribe(difficulty => result = difficulty)
      .unsubscribe();

    expect(result).toEqual(newDifficulty);
  });
});
