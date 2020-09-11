import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagService {
  private counterSource = new BehaviorSubject<number>(undefined);

  public get counter(): Observable<number> {
    return this.counterSource.asObservable();
  }

  public setCounter(newCount: number): void {
    this.counterSource.next(newCount);
  }
}
