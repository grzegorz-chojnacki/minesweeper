import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagService {
  private flagSource = new Subject<number>();
  public counter = this.flagSource.asObservable();

  public setFlags(newCount: number): void {
    this.flagSource.next(newCount);
  }

}
