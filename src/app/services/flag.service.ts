import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagService {
  private flagSource = new BehaviorSubject<number>(undefined);
  get counter(): Observable<number> {
    return this.flagSource.asObservable();
  }

  public setFlags(newCount: number): void {
    this.flagSource.next(newCount);
  }

}
