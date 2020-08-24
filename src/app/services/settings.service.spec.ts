import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import { Subscription } from 'rxjs';

describe('SettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    window.localStorage.clear();
  });

  it('should be created', () => {
    const service = TestBed.inject(SettingsService);
    expect(service).toBeTruthy();
  });

  // Field size

  it('should initialize fieldSize when local storage is empty', () => {
    const service = TestBed.inject(SettingsService);

    let fieldSize: number;
    service.fieldSize.subscribe(fs => fieldSize = fs).unsubscribe();

    expect(fieldSize).toBe(service.minFieldSize);
  });

  it('should load fieldSize when local storage is not empty', () => {
    const savedFieldSize = 32;
    localStorage.setItem('fieldSize', savedFieldSize.toString());

    const service = TestBed.inject(SettingsService);
    let fieldSize: number;
    service.fieldSize.subscribe(fs => fieldSize = fs).unsubscribe();

    expect(fieldSize).toBe(savedFieldSize);
  });

  it('should set and update new fieldSize value', () => {
    const service = TestBed.inject(SettingsService);
    const newFieldSize = 32;

    let fieldSize: number;
    service.setFieldSize(newFieldSize);
    service.fieldSize.subscribe(fs => fieldSize = fs).unsubscribe();

    expect(fieldSize).toBe(newFieldSize);
  });

  it('should not allow for fieldSize to be set out of its bounds', () => {
    const service = TestBed.inject(SettingsService);
    const invalid = [service.minFieldSize - 1, service.maxFieldSize + 1];

    invalid.forEach(value => {
      let fieldSize: number;
      service.setFieldSize(value);
      service.fieldSize.subscribe(fs => fieldSize = fs).unsubscribe();

      expect(fieldSize).not.toBe(value);
    });
  });

  // Sidenav auto hide

  it('should initialize sidenavAutoHide when local storage is empty', () => {
    const service = TestBed.inject(SettingsService);

    let sidenavAutoHide: boolean;
    service.sidenavAutoHide.subscribe(sah => sidenavAutoHide = sah)
      .unsubscribe();

    expect(sidenavAutoHide).toBe(service.defaultSidenavAutoHide);
  });

  it('should load sidenavAutoHide when local storage is not empty', () => {
    const savedValue = false;
    localStorage.setItem('sidenavAutoHide', savedValue.toString());

    const service = TestBed.inject(SettingsService);
    let sidenavAutoHide: boolean;
    service.sidenavAutoHide.subscribe(sah => sidenavAutoHide = sah)
      .unsubscribe();

    expect(sidenavAutoHide).toBe(savedValue);
  });

  it('should set and update new sidenavAutoHide value', () => {
    const service = TestBed.inject(SettingsService);
    const newValue = false;

    let sidenavAutoHide: boolean;
    service.setSidenavAutoHide(newValue);
    service.sidenavAutoHide.subscribe(sah => sidenavAutoHide = sah)
      .unsubscribe();

    expect(sidenavAutoHide).toBe(newValue);
  });
});
