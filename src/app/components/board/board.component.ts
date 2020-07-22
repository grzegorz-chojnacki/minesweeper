import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Difficulty } from 'src/app/difficulty';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnChanges {
  @Input() difficulty: Difficulty = new Difficulty('Begginer', 10, 10);
  board: number[];

  // Controlls the size of each field on the board, in pixels
  fieldSize = 40;

  // Refresh the board after starting new game
  ngOnChanges(changes: SimpleChanges): void {
    this.difficulty = changes.difficulty.currentValue;
    this.board = Array.from(Array(this.difficulty.boardDimension ** 2).keys());
  }

  getCSSGridTemplate(): string {
    return `repeat(${this.difficulty.boardDimension}, auto)`;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
