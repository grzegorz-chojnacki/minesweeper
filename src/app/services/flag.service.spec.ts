import { TestBed } from '@angular/core/testing';

import { FlagService } from './flag.service';

describe('FlagsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const service = TestBed.inject(FlagService);
    expect(service).toBeTruthy();
  });

  it('should set and and update new flag count', () => {
    const service = TestBed.inject(FlagService);
    const newFlagCount = 7;

    let result: number;
    service.setFlags(newFlagCount);
    service.counter.subscribe(count => result = count).unsubscribe();

    expect(result).toBe(newFlagCount);
  });
});
