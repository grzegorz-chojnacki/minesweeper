import { DifficultyService } from './difficulty.service';
import { Difficulty, NamedDifficulty } from 'src/app/classes/difficulty';
import { FakeStorage } from './fakeStorage';

function makeServiceWithEmptyStorage(): DifficultyService {
  return new DifficultyService(new FakeStorage());
}

describe('DifficultyService', () => {
  it('should be created', () => {
    const service = makeServiceWithEmptyStorage();
    expect(service).toBeTruthy();
  });

  it('should initialize when local storage is empty', () => {
    const service = makeServiceWithEmptyStorage();

    service.difficulty.subscribe(difficulty => {
      expect(difficulty).toBe(NamedDifficulty.initial);
    }).unsubscribe();
  });

  it('should load data when local storage is not empty', () => {
    const newDifficulty = new Difficulty(5, 5);
    const storage = new FakeStorage();
    storage.setItem('difficulty', JSON.stringify(newDifficulty));

    const service = new DifficultyService(storage);

    service.difficulty.subscribe(difficulty => {
      expect(difficulty).toEqual({...newDifficulty});
    }).unsubscribe();
  });

  it('should set and update new difficulty value', () => {
    const service = makeServiceWithEmptyStorage();
    const newDifficulty = new Difficulty(5, 5);

    service.newDifficulty(newDifficulty);

    service.difficulty.subscribe(difficulty => {
      expect(difficulty).toEqual(newDifficulty);
    }).unsubscribe();
  });
});
