import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Difficulty, NamedDifficulty } from 'src/app/classes/difficulty';

@Injectable({
  providedIn: 'root',
  useFactory: () => new DifficultyService(localStorage)
})
export class DifficultyService {
  public readonly initial: Difficulty =
    JSON.parse(this.storage.getItem('difficulty'))
    || NamedDifficulty.presets[0];

  public readonly difficultySource = new BehaviorSubject(this.initial);
  public get difficulty(): Observable<Difficulty> {
    return this.difficultySource.asObservable();
  }

  constructor(private readonly storage: Storage) { }

  public newDifficulty(d: Difficulty): void {
    this.storage.setItem('difficulty', JSON.stringify(d));
    this.difficultySource.next(d);
  }
}
