import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Difficulty, difficulties } from 'src/app/classes/difficulty';

@Injectable({
  providedIn: 'root'
})
export class DifficultyService {
  public readonly initialDifficulty: Difficulty =
    JSON.parse(localStorage.getItem('difficulty')) || difficulties[0];

  private difficultySource = new BehaviorSubject(this.initialDifficulty);
  get difficulty(): Observable<Difficulty> {
    return this.difficultySource.asObservable();
  }

  public newDifficulty(newDifficulty: Difficulty): void {
    this.difficultySource.next(newDifficulty);
    localStorage.setItem('difficulty', JSON.stringify(newDifficulty));
  }
}
