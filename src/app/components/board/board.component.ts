import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Difficulty } from 'src/app/classes/difficulty';
import { Board, GameState } from 'src/app/classes/board';
import { BombPlanter } from 'src/app/classes/bombPlanter';
import { Field } from 'src/app/classes/field';
import { DifficultyService } from 'src/app/services/difficulty.service';
import { FlagService } from 'src/app/services/flag.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
  private _board: Board;
  public get board(): Board { return this._board; }
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
      .subscribe(difficulty => this.newBoard(difficulty));
  }

  private newBoard(difficulty: Difficulty): void {
    this.snackBarService.dismiss();
    const bombPlanter = new BombPlanter(difficulty);
    this._board = new Board(bombPlanter);
    this.flagService.setCounter(this.board.flagCounter);
    this.cdr.markForCheck();
  }

  public useBoard(board: Board): void {
    this.snackBarService.dismiss();
    this._board = board;
    this.flagService.setCounter(this.board.flagCounter);
    this.cdr.markForCheck();
  }

  public onClick(field: Field): void {
    const gameState = this.board.check(field);
    this.reactTo(gameState);
    this.flagService.setCounter(this.board.flagCounter);
    this.cdr.markForCheck();
  }

  // Prevent showing context menu by returning false
  public onRightClick(field: Field): boolean {
    this.board.toggleFlag(field);
    this.flagService.setCounter(this.board.flagCounter);
    this.cdr.markForCheck();
    return false;
  }

  private spawnSnackBar(title: string, config: MatSnackBarConfig): void {
    const snackBar = this.snackBarService
      .open(title, 'Restart', config);
    snackBar.onAction().subscribe(() => this.newBoard(this.board.difficulty));
  }

  private reactTo(gameState: GameState): void {
    switch (gameState) {
      case GameState.Won:
        this.spawnSnackBar('You won!', this.snackBarConfig.gameWon);
        break;
      case GameState.Lost:
        this.spawnSnackBar('Game over', this.snackBarConfig.gameOver);
        break;
      case GameState.Continues:
        break;
    }
  }
}
