import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Difficulty } from 'src/app/difficulty';
import { FieldSizeService } from '../../services/field-size.service';
import { Board } from '../../board';
import { Field } from '../../field';
import { fieldColors } from './fieldColors';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnChanges {
  @Input() difficulty: Difficulty;
  private isFirstClick: boolean;
  fieldColors = fieldColors;
  board: Board;

  // Controlls the size of each field on the board, in pixels
  fieldSize: number;

  constructor(private fieldSizeService: FieldSizeService) { }

  // Refresh the board after starting new game
  ngOnChanges(changes: SimpleChanges): void {
    this.difficulty = changes.difficulty.currentValue;
    this.isFirstClick = true;
    this.board = new Board(this.difficulty);
  }

  ngOnInit(): void {
    this.fieldSizeService.fieldSize.subscribe(
      fieldSize => this.fieldSize = fieldSize
    );
    this.board = new Board(this.difficulty);
  }

  onClick(field: Field): void {
    if (this.isFirstClick) {
      this.board.plantBombs(field);
      this.isFirstClick = false;
    }
    if (field.isFlagged()) {
      field.toggleFlag();
    } else if (field.getValue() !== Field.bomb) {
      this.board.checkNear(field);
    } else {
      this.showAll();
    }
  }

  // Debug method
  quickRestart(): void {
    this.isFirstClick = true;
    this.board = new Board(this.difficulty);
  }

  // Debug method
  showAll(): void {
    this.board.showAll();
  }

  // Prevent showing context menu by returning false
  onRigthClick(field: Field): boolean {
    if (!field.isChecked()) {
      field.toggleFlag();
    }
    return false;
  }

}
