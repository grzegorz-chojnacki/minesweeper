import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Difficulty } from 'src/app/difficulty';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnChanges {
  @Input() difficulty: Difficulty;
  board: number[];

  // Controlls the size of each field on the board, in pixels
  fieldSize = 40;

  // [Temporary] generate testing number array that can represent the board
  generateBoard(boardDimension): number[] {
    return Array.from(
      Array(boardDimension ** 2).keys()
    );
  }

  getCSSGridTemplate(): string {
    return `repeat(${this.difficulty.boardDimension}, auto)`;
  }

  // Refresh the board after starting new game
  ngOnChanges(changes: SimpleChanges): void {
    this.difficulty = changes.difficulty.currentValue;
    this.board = this.generateBoard(this.difficulty.boardDimension);
  }

  constructor() { }

  ngOnInit(): void {
    this.board = this.generateBoard(this.difficulty.boardDimension);
  }

}
