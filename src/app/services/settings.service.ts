import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
  useFactory: () => new SettingsService(localStorage)
})
export class SettingsService {
  public readonly minFieldSize = 30;
  public readonly maxFieldSize = 60;
  public readonly defaultSidenavAutoHide = true;

  private readonly fieldSizeSource = new BehaviorSubject(
    Number(this.storage.getItem('fieldSize')) || this.minFieldSize);

  private readonly sidenavAutoHideSource = new BehaviorSubject(
    this.parseStorageBoolean(
      this.storage.getItem('sidenavAutoHide'),
      this.defaultSidenavAutoHide));

  constructor(private readonly storage: Storage) { }

  private parseStorageBoolean(item: string, initValue = false): boolean {
    return (item !== null) ? item === 'true' : initValue;
  }

  public get fieldSize(): Observable<number> {
    return this.fieldSizeSource.asObservable();
  }

  public setFieldSize(newFieldSize: number): void {
    if (this.minFieldSize <= newFieldSize && newFieldSize <= this.maxFieldSize) {
      this.fieldSizeSource.next(newFieldSize);
      this.storage.setItem('fieldSize', newFieldSize.toString());
    }
  }

  public get sidenavAutoHide(): Observable<boolean> {
    return this.sidenavAutoHideSource.asObservable();
  }

  public setSidenavAutoHide(newOption: boolean): void {
    this.sidenavAutoHideSource.next(newOption);
    this.storage.setItem('sidenavAutoHide', newOption.toString());
  }
}
