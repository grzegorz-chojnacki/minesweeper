import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Difficulty, difficulties, customDifficulty } from '../../difficulty';
import { FieldSizeService } from '../../services/field-size.service';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @Output() public newGameEvent = new EventEmitter<Difficulty>();
  public fieldSize: number;

  public difficultyList = [customDifficulty, ...difficulties];
  public difficultyNames = difficulties.map(difficulty => difficulty.name);
  public difficulty: Difficulty;

  // Inputs
  public numberOfBombs: number;
  public boardDimension: number;

  // Update inputs based on selected preset, but prevent setting them to
  // undefined if the user chooses the 'Custom' preset
  public onSelectUpdate(): void {
    if (this.difficulty !== customDifficulty) {
      this.boardDimension = this.difficulty.boardDimension;
      this.numberOfBombs = this.difficulty.numberOfBombs;
    }
  }

  // Try to match current input values to existing preset, or set it as custom
  public onInputUpdate(): void {
    // Update values on custom difficulty setting
    customDifficulty.boardDimension = this.boardDimension;
    customDifficulty.numberOfBombs = this.numberOfBombs;

    this.difficulty = difficulties.find(difficulty => {
      return this.boardDimension === difficulty.boardDimension
          && this.numberOfBombs  === difficulty.numberOfBombs;
    }) || customDifficulty;
  }

  public onFieldSizeChange(event: MatSliderChange): void {
    this.fieldSizeService.setFieldSize(event.value);
  }

  constructor(public fieldSizeService: FieldSizeService) { }

  // Initialize settings with saved values and emit initial new game event
  public ngOnInit(): void {
    this.fieldSizeService.fieldSize
      .subscribe(fieldSize => this.fieldSize = fieldSize);

    this.difficulty = JSON.parse(localStorage.getItem('difficulty'))
      || difficulties[0];

    this.boardDimension = this.difficulty.boardDimension;
    this.numberOfBombs = this.difficulty.numberOfBombs;

    this.onInputUpdate(); // Refresh select component
    this.newGameEvent.emit(this.difficulty);
  }

  public isBoardDimensionInvalid(): boolean {
    return this.difficulty.boardDimension < 1;
  }

  // Every field on the board can have a bomb, except the clicked one
  public maxNumberOfBombs(): number {
    return this.difficulty.boardDimension ** 2 - 1;
  }

  public isNumberOfBombsInvalid(): boolean {
    return this.difficulty.numberOfBombs < 0 ||
      this.difficulty.numberOfBombs > this.maxNumberOfBombs();
  }

  public isInvalid(): boolean {
    return this.isNumberOfBombsInvalid() ||
      this.isBoardDimensionInvalid();
  }

  public start(): void {
    localStorage.setItem('difficulty', JSON.stringify(this.difficulty));
    this.newGameEvent.emit(this.difficulty);
  }

}
