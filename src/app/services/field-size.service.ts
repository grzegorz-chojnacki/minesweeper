import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldSizeService {

  private fieldSizeSource = new BehaviorSubject(30);
  fieldSize = this.fieldSizeSource.asObservable();

  constructor() { }

  setFieldSize(newFieldSize: number): void {
    this.fieldSizeSource.next(newFieldSize);
  }
}
