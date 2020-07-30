import { Component } from '@angular/core';
import { Difficulty } from './difficulty';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'minesweeper';
  public difficulty: Difficulty;

  public onNewGameEvent(difficulty: Difficulty): void {
    this.difficulty = difficulty;
  }
}
