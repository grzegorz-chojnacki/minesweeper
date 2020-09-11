import { SettingsService } from './settings.service';
import { FakeStorage } from './fakeStorage';

function makeServiceWithEmptyStorage(): SettingsService {
  return new SettingsService(new FakeStorage());
}

describe('SettingsService', () => {
  it('should be created', () => {
    const service = makeServiceWithEmptyStorage();
    expect(service).toBeTruthy();
  });

  it('should initialize fieldSize when local storage is empty', () => {
    const service = makeServiceWithEmptyStorage();

    let fieldSize: number;
    service.fieldSize.subscribe(fs => fieldSize = fs).unsubscribe();

    expect(fieldSize).toBe(service.minFieldSize);
  });

  it('should load fieldSize when local storage is not empty', () => {
    const savedFieldSize = 32;
    const storage = new FakeStorage();
    storage.setItem('fieldSize', savedFieldSize.toString());

    const service = new SettingsService(storage);
    let fieldSize: number;
    service.fieldSize.subscribe(fs => fieldSize = fs).unsubscribe();

    expect(fieldSize).toBe(savedFieldSize);
  });

  it('should set and update new fieldSize value', () => {
    const service = makeServiceWithEmptyStorage();
    const newFieldSize = 32;

    let fieldSize: number;
    service.setFieldSize(newFieldSize);
    service.fieldSize.subscribe(fs => fieldSize = fs).unsubscribe();

    expect(fieldSize).toBe(newFieldSize);
  });

  it('should not allow for fieldSize to be set out of its bounds', () => {
    const service = makeServiceWithEmptyStorage();
    const invalid = [service.minFieldSize - 1, service.maxFieldSize + 1];

    invalid.forEach(value => {
      let fieldSize: number;
      service.setFieldSize(value);
      service.fieldSize.subscribe(fs => fieldSize = fs).unsubscribe();

      expect(fieldSize).not.toBe(value);
    });
  });

  it('should initialize sidenavAutoHide when local storage is empty', () => {
    const service = makeServiceWithEmptyStorage();

    let sidenavAutoHide: boolean;
    service.sidenavAutoHide.subscribe(sah => sidenavAutoHide = sah)
      .unsubscribe();

    expect(sidenavAutoHide).toBe(service.defaultSidenavAutoHide);
  });

  it('should load sidenavAutoHide when local storage is not empty', () => {
    const savedValue = false;
    const storage = new FakeStorage();
    storage.setItem('sidenavAutoHide', savedValue.toString());

    const service = new SettingsService(storage);
    let sidenavAutoHide: boolean;
    service.sidenavAutoHide.subscribe(sah => sidenavAutoHide = sah)
      .unsubscribe();

    expect(sidenavAutoHide).toBe(savedValue);
  });

  it('should set and update new sidenavAutoHide value', () => {
    const service = makeServiceWithEmptyStorage();
    const newValue = false;

    let sidenavAutoHide: boolean;
    service.setSidenavAutoHide(newValue);
    service.sidenavAutoHide.subscribe(sah => sidenavAutoHide = sah)
      .unsubscribe();

    expect(sidenavAutoHide).toBe(newValue);
  });
});
