import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Difficulty, difficulties } from '../difficulty';

@Injectable({
  providedIn: 'root'
})
export class DifficultyService {
  public initialDifficulty: Difficulty =
    JSON.parse(localStorage.getItem('difficulty')) || difficulties[0];

  private difficultySource = new BehaviorSubject(this.initialDifficulty);
  public difficulty = this.difficultySource.asObservable();

  public newDifficulty(newDifficulty: Difficulty): void {
    this.difficultySource.next(newDifficulty);
    localStorage.setItem('difficulty', JSON.stringify(newDifficulty));
  }
}
