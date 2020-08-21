import { Component, OnInit, Input, ChangeDetectionStrategy,
         ChangeDetectorRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Difficulty } from 'src/app/difficulty';
import { FieldSizeService } from '../../services/field-size.service';
import { DifficultyService } from '../../services/difficulty.service';
import { Board } from '../../board';
import { Field } from '../../field';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
  @Input() public difficulty: Difficulty;
  private isFirstClick: boolean;
  public board: Board;
  public fieldSize: number; // Size of each field on the board, in pixels
  private gameWon: MatSnackBarConfig = {
    duration: 16000,
    panelClass: ['game-won-snack-bar']
  };
  private gameOver: MatSnackBarConfig = {
    duration: 16000,
    panelClass: ['game-over-snack-bar']
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private fieldSizeService: FieldSizeService,
    private difficultyService: DifficultyService,
    private snackBarService: MatSnackBar) { }

  public ngOnInit(): void {
    this.fieldSizeService.fieldSize
      .subscribe(fieldSize => {
        this.fieldSize = fieldSize;
        this.cdr.markForCheck();
      });

    this.difficultyService.difficulty
      .subscribe(difficulty => {
        this.difficulty = difficulty;
        this.newBoard(this.difficulty);
      });
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
      this.spawnSnackBar('Game over', this.gameOver);
    }
    // Check win condition
    if (this.board.countUncheckedFields() === this.difficulty.numberOfBombs) {
      this.showAll();
      this.spawnSnackBar('You won!', this.gameWon);
    }
    this.cdr.markForCheck();
  }

  private spawnSnackBar(title: string, config: MatSnackBarConfig): void {
    const snackBar = this.snackBarService
      .open(title, 'Restart', config);
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
