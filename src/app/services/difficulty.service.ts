import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Difficulty, difficulties } from 'src/app/classes/difficulty';

@Injectable({
  providedIn: 'root',
  useFactory: () => new DifficultyService(localStorage)
})
export class DifficultyService {
  public readonly initialDifficulty: Difficulty =
    JSON.parse(this.storage.getItem('difficulty'))
    || difficulties[0];

  public readonly difficultySource = new BehaviorSubject(this.initialDifficulty);
  public get difficulty(): Observable<Difficulty> {
    return this.difficultySource.asObservable();
  }

  constructor(private readonly storage: Storage) { }

  public newDifficulty(d: Difficulty): void {
    this.storage.setItem('difficulty', JSON.stringify(d));
    this.difficultySource.next(d);
  }
}
