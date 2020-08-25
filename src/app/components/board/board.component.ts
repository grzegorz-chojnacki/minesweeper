import { Component, OnInit, Input, ChangeDetectionStrategy,
         ChangeDetectorRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Difficulty } from 'src/app/difficulty';
import { SettingsService } from '../../services/settings.service';
import { DifficultyService } from '../../services/difficulty.service';
import { FlagService } from '../../services/flag.service';
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

  private readonly snackBarConfig: { [state: string]: MatSnackBarConfig } = {
    gameWon:  { duration: 16000, panelClass: ['game-won-snack-bar'] },
    gameOver: { duration: 16000, panelClass: ['game-over-snack-bar'] }
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private settingsService: SettingsService,
    private difficultyService: DifficultyService,
    private snackBarService: MatSnackBar,
    private flagService: FlagService) { }

  public ngOnInit(): void {
    this.settingsService.fieldSize
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
    this.flagService.setFlags(this.board.flagCounter);
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
      this.flagService.setFlags(this.board.flagCounter); // Update flag counter
    } else {
      this.endGame();
      this.spawnSnackBar('Game over', this.snackBarConfig.gameOver);
    }
    // Check win condition
    if (this.board.countUncheckedFields() === this.difficulty.numberOfBombs) {
      this.endGame();
      this.spawnSnackBar('You won!', this.snackBarConfig.gameWon);
    }
    this.cdr.markForCheck();
  }

  private spawnSnackBar(title: string, config: MatSnackBarConfig): void {
    const snackBar = this.snackBarService
      .open(title, 'Restart', config);
    snackBar.onAction().subscribe(() => this.newBoard(this.difficulty));
  }

  private endGame(): void {
    this.flagService.setFlags(undefined);
    this.board.checkAll();
  }

  // Prevent showing context menu by returning false
  public onRigthClick(field: Field): boolean {
    if (this.board.flagCounter > 0 || field.isFlagged) {
      this.board.toggleFlag(field);
      this.flagService.setFlags(this.board.flagCounter);
    }
    return false;
  }
}
