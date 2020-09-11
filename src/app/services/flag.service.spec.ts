import { FlagService } from './flag.service';

describe('FlagsService', () => {
  it('should be created', () => {
    const service = new FlagService();
    expect(service).toBeTruthy();
  });

  it('should init with undefined flag count', () => {
    const service = new FlagService();

    service.counter.subscribe(count => {
      expect(count).toBe(undefined);
    }).unsubscribe();
  });

  it('should set and and update new flag count', () => {
    const service = new FlagService();
    const newFlagCount = 7;

    service.setCounter(newFlagCount);

    service.counter.subscribe(count => {
      expect(count).toBe(newFlagCount);
    }).unsubscribe();
  });
});
