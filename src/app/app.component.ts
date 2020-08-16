import { Component, ViewChild } from '@angular/core';
import { Difficulty } from './difficulty';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  public title = 'minesweeper';
  public difficulty: Difficulty;

  public onNewGameEvent(difficulty: Difficulty): void {
    this.difficulty = difficulty;
  }

  public onCloseSidenavEvent(): void {
    this.sidenav.close();
  }
}
