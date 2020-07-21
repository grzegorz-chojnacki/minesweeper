import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Difficulty, difficulties } from '../../difficulty';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @Output() newGameEvent = new EventEmitter<Difficulty>();

  difficulties = difficulties;
  difficultyNames = difficulties.map(difficulty => difficulty.name);

  // Special difficulty
  customDifficulty = difficulties[0];

  // Set initial difficulty
  difficulty: Difficulty = difficulties[1];
  boardDimension: number = this.difficulty.boardDimension;
  numberOfBombs: number = this.difficulty.numberOfBombs;

  // Update inputs based on selected preset, but prevent setting them to
  // undefined if the user chooses the 'Custom' preset
  updateInputs(): void {
    if (this.difficulty !== this.customDifficulty) {
      this.boardDimension = this.difficulty.boardDimension;
      this.numberOfBombs = this.difficulty.numberOfBombs;
    }
  }

  // Try to match current input values to existing preset, or set it to custom
  updateSelect(): void {
    this.difficulty = difficulties.find(difficulty => {
      return this.boardDimension === difficulty.boardDimension &&
        this.numberOfBombs === difficulty.numberOfBombs;
    }) || this.customDifficulty;
  }

  constructor() { }

  ngOnInit(): void {
  }

  isBoardDimensionInvalid(): boolean {
    return this.boardDimension < 1;
  }

  // Every field on the board can have a bomb, except the clicked one
  maxNumberOfBombs(): number {
    return this.boardDimension ** 2 - 1;
  }

  isNumberOfBombsInvalid(): boolean {
    return this.numberOfBombs < 0 ||
      this.numberOfBombs > this.maxNumberOfBombs();
  }

  isInvalid(): boolean {
    return this.isNumberOfBombsInvalid() ||
      this.isBoardDimensionInvalid();
  }

  // TODO: Make it so that `this.difficulty` is used instead of new object
  start(): void {
    this.newGameEvent.emit(new Difficulty(
      this.difficulty.name,
      this.boardDimension,
      this.numberOfBombs
    ));
  }

}
