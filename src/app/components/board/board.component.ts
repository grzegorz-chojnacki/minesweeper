import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Difficulty } from 'src/app/difficulty';
import { FieldSizeService } from '../../services/field-size.service';
import { Board } from '../../board';
import { Field } from '../../field';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnChanges {
  @Input() difficulty: Difficulty;
  board: Board;

  // Controlls the size of each field on the board, in pixels
  fieldSize: number;

  constructor(private fieldSizeService: FieldSizeService) { }

  // Refresh the board after starting new game
  ngOnChanges(changes: SimpleChanges): void {
    this.difficulty = changes.difficulty.currentValue;
    this.board = new Board(this.difficulty);
  }

  ngOnInit(): void {
    this.fieldSizeService.fieldSize.subscribe(
      fieldSize => this.fieldSize = fieldSize
    );
    this.board = new Board(this.difficulty);
    console.log(this.board);
  }

  onClick(x: number, y: number): void {
    const field = this.board.getFields()[y][x];
    if (!field.isChecked()) {
      if (field.isFlagged()) {
        field.toggleFlag();
      } else {
        field.check();
      }
    }
  }

  // Prevent showing context menu by returning false
  onRigthClick(field: Field): boolean {
    if (!field.isChecked()) {
      field.toggleFlag();
    }
    return false;
  }

}
