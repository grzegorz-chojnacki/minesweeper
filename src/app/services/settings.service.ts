import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public readonly minFieldSize = 30;
  public readonly maxFieldSize = 60;
  public readonly defaultSidenavAutoHide = true;

  private fieldSizeSource = new BehaviorSubject(
    Number(localStorage.getItem('fieldSize')) || this.minFieldSize);

  get fieldSize(): Observable<number> {
    return this.fieldSizeSource.asObservable();
  }

  private sidenavAutoHideSource = new BehaviorSubject(
    this.localStorageGetBoolean(
      localStorage.getItem('sidenavAutoHide'),
      this.defaultSidenavAutoHide));

  get sidenavAutoHide(): Observable<boolean> {
    return this.sidenavAutoHideSource.asObservable();
  }

  // Parse boolean from local storage or return some initial value if not found
  private localStorageGetBoolean(item: string, initValue = false): boolean {
    return (item !== null) ? item === 'true' : initValue;
  }

  public setFieldSize(newFieldSize: number): void {
    if (this.minFieldSize <= newFieldSize && newFieldSize <= this.maxFieldSize) {
      this.fieldSizeSource.next(newFieldSize);
      localStorage.setItem('fieldSize', newFieldSize.toString());
    }
  }

  public setSidenavAutoHide(newOption: boolean): void {
    this.sidenavAutoHideSource.next(newOption);
    localStorage.setItem('sidenavAutoHide', newOption.toString());
  }
}
