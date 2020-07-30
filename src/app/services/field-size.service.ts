import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldSizeService {
  public readonly minFieldSize = 30;
  public readonly maxFieldSize = 60;

  private fieldSizeSource = new BehaviorSubject(
    Number(localStorage.getItem('fieldSize')) || this.minFieldSize
  );
  public fieldSize = this.fieldSizeSource.asObservable();

  public setFieldSize(newFieldSize: number): void {
    this.fieldSizeSource.next(newFieldSize);
    localStorage.setItem('fieldSize', newFieldSize.toString());
  }
}
