import { SettingsService } from './settings.service';
import { FakeStorage } from './fakeStorage';

function makeServiceWithEmptyStorage(): SettingsService {
  return new SettingsService(new FakeStorage());
}

describe('SettingsService', () => {
  describe('Initialization behaviour', () => {
    it('should be created', () => {
      const service = makeServiceWithEmptyStorage();
      expect(service).toBeTruthy();
    });

    it('should initialize fieldSize when local storage is empty', () => {
      const service = makeServiceWithEmptyStorage();

      service.fieldSize.subscribe(fieldSize =>
        expect(fieldSize).toBe(service.minFieldSize)
      ).unsubscribe();
    });

    it('should load fieldSize when local storage is not empty', () => {
      const savedFieldSize = 32;
      const storage = new FakeStorage();
      storage.setItem('fieldSize', savedFieldSize.toString());

      const service = new SettingsService(storage);

      service.fieldSize.subscribe(fieldSize =>
        expect(fieldSize).toBe(savedFieldSize)
      ).unsubscribe();
    });

    it('should initialize sidenavAutoHide when local storage is empty', () => {
      const service = makeServiceWithEmptyStorage();

      service.sidenavAutoHide.subscribe(sidenavAutoHide =>
        expect(sidenavAutoHide).toBe(service.defaultSidenavAutoHide)
      ).unsubscribe();
    });

    it('should load sidenavAutoHide when local storage is not empty', () => {
      const savedValue = false;
      const storage = new FakeStorage();
      storage.setItem('sidenavAutoHide', savedValue.toString());

      const service = new SettingsService(storage);
      service.sidenavAutoHide.subscribe(sidenavAutoHide =>
        expect(sidenavAutoHide).toBe(savedValue)
      ).unsubscribe();
    });
  });

  describe('Field size behaviour', () => {
    it('should set and update new fieldSize value', () => {
      const service = makeServiceWithEmptyStorage();
      const newFieldSize = 32;

      service.setFieldSize(newFieldSize);

      service.fieldSize.subscribe(fieldSize =>
        expect(fieldSize).toBe(newFieldSize)
      ).unsubscribe();
    });

    it('should not allow for fieldSize to be set out of its bounds', () => {
      const service = makeServiceWithEmptyStorage();
      const invalidValues = [service.minFieldSize - 1, service.maxFieldSize + 1];

      for (const value of invalidValues) {
        service.setFieldSize(value);
        service.fieldSize.subscribe(fieldSize =>
          expect(fieldSize).not.toBe(value)
        ).unsubscribe();
      }
    });
  });

  describe('Sidenav autohide behaviour', () => {
    it('should set and update new sidenavAutoHide value', () => {
      const service = makeServiceWithEmptyStorage();
      const newValue = false;

      service.setSidenavAutoHide(newValue);
      service.sidenavAutoHide.subscribe(sidenavAutoHide =>
      expect(sidenavAutoHide).toBe(newValue)
      ).unsubscribe();
    });
  });
});
