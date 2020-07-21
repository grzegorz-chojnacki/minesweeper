import { Component } from '@angular/core';
import { Difficulty } from './difficulty';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'minesweeper';
  difficulty: Difficulty;

  onNewGameEvent(difficulty: Difficulty): void {
    console.log(difficulty);
    this.difficulty = difficulty;
  }
}
