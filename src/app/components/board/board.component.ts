import { Component, OnInit, Input, SimpleChanges, OnChanges,
         ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Difficulty } from 'src/app/difficulty';
import { FieldSizeService } from '../../services/field-size.service';
import { Board } from '../../board';
import { Field } from '../../field';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit, OnChanges {
  @Input() public difficulty: Difficulty;
  private isFirstClick: boolean;
  public board: Board;
  public fieldSize: number; // Size of each field on the board, in pixels
  private snackBarConfig = {
    duration: 16000,
    panelClass: ['dark-snack-bar']
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private fieldSizeService: FieldSizeService,
    private snackBarService: MatSnackBar) { }

  // Refresh the board after starting new game
  public ngOnChanges(changes: SimpleChanges): void {
    this.difficulty = changes.difficulty.currentValue;
    this.newBoard(this.difficulty);
  }

  public ngOnInit(): void {
    this.fieldSizeService.fieldSize
      .subscribe(fieldSize => {
        this.fieldSize = fieldSize;
        this.cdr.markForCheck();
      });
    this.newBoard(this.difficulty);
  }

  private newBoard(difficulty: Difficulty): void {
    this.snackBarService.dismiss();
    this.isFirstClick = true;
    this.board = new Board(difficulty);
    this.cdr.markForCheck();
  }

  public onClick(field: Field): void {
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
    this.cdr.markForCheck();
  }

  private spawnSnackBar(title: string): void {
    const snackBar = this.snackBarService
      .open(title, 'Restart', this.snackBarConfig);
    snackBar.onAction().subscribe(() => this.newBoard(this.difficulty));
  }

  private showAll(): void {
    this.board.checkAll();
  }

  // Prevent showing context menu by returning false
  public onRigthClick(field: Field): boolean {
    if (this.board.flagCounter > 0 || field.isFlagged) {
      this.board.toggleFlag(field);
    }
    return false;
  }
}
