import { TestBed } from '@angular/core/testing';

import { DifficultyService } from './difficulty.service';
import { Difficulty, difficulties } from '../difficulty';

describe('DifficultyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    window.localStorage.clear();
  });

  it('should be created', () => {
    const service = TestBed.inject(DifficultyService);
    expect(service).toBeTruthy();
  });

  it('should initialize when local storage is empty', () => {
    const service = TestBed.inject(DifficultyService);

    let result: Difficulty;
    service.difficulty.subscribe(difficulty => result = difficulty);

    expect(result).toBe(difficulties[0]);
  });

  it('should load data when local storage is not empty', () => {
    const newDifficulty = new Difficulty('', 5, 5);
    window.localStorage.setItem('difficulty', JSON.stringify(newDifficulty));

    const service = TestBed.inject(DifficultyService);

    let result: Difficulty;
    service.difficulty.subscribe(difficulty => result = difficulty);

    // Compare only members, not object type
    // (which for some reason is different)
    expect({...result}).toEqual({...newDifficulty});
  });

  it('should set and update new difficulty value', () => {
    const service = TestBed.inject(DifficultyService);
    const newDifficulty = new Difficulty('', 5, 5);

    service.newDifficulty(newDifficulty);

    let result: Difficulty;
    service.difficulty.subscribe(difficulty => result = difficulty);

    expect(result).toEqual(newDifficulty);
  });
});
