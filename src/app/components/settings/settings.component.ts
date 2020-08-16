import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  public difficultyNames = this.difficultyList
    .map(difficulty => difficulty.name);

  private initialDifficulty: Difficulty = JSON.parse(
    localStorage.getItem('difficulty')
  ) || difficulties[0];

  public settingsForm = this.formBuilder.group({
    name: this.initialDifficulty.name,
    boardDimension: this.initialDifficulty.boardDimension,
    numberOfBombs: this.initialDifficulty.numberOfBombs
  });

  constructor(
    public formBuilder: FormBuilder,
    public fieldSizeService: FieldSizeService) { }

  public onFieldSizeChange(event: MatSliderChange): void {
    this.fieldSizeService.setFieldSize(event.value);
  }

  // Try to match difficulty preset with boardDimension & numberOfBombs values
  private updateSelect(): void {
    const boardDimension = this.settingsForm.get('boardDimension').value;
    const numberOfBombs = this.settingsForm.get('numberOfBombs').value;

    const preset = this.difficultyList.find(difficulty => {
      return boardDimension === difficulty.boardDimension
          && numberOfBombs  === difficulty.numberOfBombs;
    }) || customDifficulty;

    this.settingsForm.patchValue({ name: preset.name }, { emitEvent: false });
  }

  // Set boardDimension & numberOfBombs to values from selected preset
  private updateInputs(): void {
    const difficultyName = this.settingsForm.get('name').value;
    const preset = this.difficultyList
      .find(difficulty => difficulty.name === difficultyName);

    if (preset !== customDifficulty) {
      this.settingsForm.patchValue({
        boardDimension: preset.boardDimension,
        numberOfBombs: preset.numberOfBombs
      }, { emitEvent: false });
    }
  }

  // Setup form and slider control and emit initial new game event
  public ngOnInit(): void {
    // Select
    this.settingsForm.get('name').valueChanges.subscribe(
      () => this.updateInputs()
    );

    // Inputs
    [
      this.settingsForm.get('numberOfBombs'),
      this.settingsForm.get('boardDimension')
    ].map(input => input.valueChanges
     .subscribe(() => this.updateSelect()));

    // Slider
    this.fieldSizeService.fieldSize
      .subscribe(fieldSize => this.fieldSize = fieldSize);

    this.newGameEvent.emit(this.settingsForm.value);
  }

  // public isBoardDimensionInvalid(): boolean {
  //   return this.difficulty.boardDimension < 1;
  // }

  // // Every field on the board can have a bomb, except the clicked one
  // public maxNumberOfBombs(): number {
  //   return this.difficulty.boardDimension ** 2 - 1;
  // }

  // public isNumberOfBombsInvalid(): boolean {
  //   return this.difficulty.numberOfBombs < 0 ||
  //     this.difficulty.numberOfBombs > this.maxNumberOfBombs();
  // }

  // public isInvalid(): boolean {
  //   return this.isNumberOfBombsInvalid() ||
  //     this.isBoardDimensionInvalid();
  // }

  // Save newest difficulty setting
  // Emit event with cloned difficulty object to force change detection
  public onSubmit(): void {
    const difficulty: Difficulty = new Difficulty(
      this.settingsForm.get('name').value,
      this.settingsForm.get('boardDimension').value,
      this.settingsForm.get('numberOfBombs').value
    );
    localStorage.setItem('difficulty', JSON.stringify(difficulty));
    this.newGameEvent.emit(difficulty);
    console.log(difficulty);
  }

}
