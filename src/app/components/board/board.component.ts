import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  private isFirstClick: boolean;
  board: Board;

  snackBarConfig = {
    duration: 8000,
    panelClass: ['dark-snack-bar']
  };

  // Controlls the size of each field on the board, in pixels
  fieldSize: number;

  constructor(private fieldSizeService: FieldSizeService,
              private snackBarService: MatSnackBar) { }

  // Refresh the board after starting new game
  ngOnChanges(changes: SimpleChanges): void {
    this.difficulty = changes.difficulty.currentValue;
    this.newBoard();
  }

  ngOnInit(): void {
    this.fieldSizeService.fieldSize.subscribe(
      fieldSize => this.fieldSize = fieldSize
    );
    this.newBoard();
  }

  newBoard(): void {
    this.snackBarService.dismiss();
    this.isFirstClick = true;
    this.board = new Board(this.difficulty);
  }

  onClick(field: Field): void {
    // Plant bombs on the first click
    if (this.isFirstClick) {
      this.board.plantBombs(field);
      this.isFirstClick = false;
    }
    // Handle clicking on flags, safe fields and bombs
    if (field.isFlagged) {
      this.board.toggleFlag(field);
    } else if (field.value !== Field.bomb) {
      this.board.checkNear(field);
    } else {
      this.showAll();
      this.spawnSnackBar('Game over');
    }
    // Check win condition
    if (this.board.countUncheckedFields() === this.difficulty.numberOfBombs) {
      this.showAll();
      this.spawnSnackBar('You won!');
    }
  }

  private spawnSnackBar(title: string): void {
    const snackBar = this.snackBarService.open(title, 'Restart',
      this.snackBarConfig);
    snackBar.onAction().subscribe(() => this.newBoard());
  }

  showAll(): void {
    this.board.checkAll();
  }

  // Prevent showing context menu by returning false
  onRigthClick(field: Field): boolean {
    if (this.board.getFlagCounter() > 0 || field.isFlagged) {
      this.board.toggleFlag(field);
    }
    return false;
  }

}
