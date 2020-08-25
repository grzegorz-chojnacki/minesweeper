import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagService {
  private flagSource = new BehaviorSubject<number>(undefined);
  public counter = this.flagSource.asObservable();

  public setFlags(newCount: number): void {
    this.flagSource.next(newCount);
  }

}
