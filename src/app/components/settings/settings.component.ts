import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Difficulty, difficulties, customDifficulty } from '../../difficulty';
import { FieldSizeService } from '../../services/field-size.service';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @Output() public closeSidenav = new EventEmitter<void>();
  @Output() public newGameEvent = new EventEmitter<Difficulty>();
  public fieldSize: number;
  public shouldCloseSidenav =
    localStorage.getItem('shouldCloseSidenav') === 'true';

  public difficultyList = [customDifficulty, ...difficulties];
  public difficultyNames = this.difficultyList
    .map(difficulty => difficulty.name);

  public settingsForm = this.formBuilder.group(
    JSON.parse(localStorage.getItem('difficulty')) || difficulties[0]
  );
  public maxNumberOfBombs = this.getMaxNumberOfBombs();

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

    const preset = this.difficultyList.find(difficulty =>
      boardDimension === difficulty.boardDimension
      && numberOfBombs === difficulty.numberOfBombs
    ) || customDifficulty;

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

  private getMaxNumberOfBombs(): number {
    return this.settingsForm.get('boardDimension').value ** 2 - 1;
  }

  private inputValidation(): void {
    this.maxNumberOfBombs = this.getMaxNumberOfBombs();

    this.settingsForm.get('numberOfBombs').setValidators([
      Validators.required, Validators.min(0),
      Validators.max(this.maxNumberOfBombs)
    ]);

    this.settingsForm.get('boardDimension')
      .updateValueAndValidity({ emitEvent: false });
    this.settingsForm.get('numberOfBombs')
      .updateValueAndValidity({ emitEvent: false });
  }

  // Setup form and slider control and emit initial new game event
  public ngOnInit(): void {
    // Select
    this.settingsForm.get('name').valueChanges
      .subscribe(() => this.updateInputs());

    // Inputs
    [
      this.settingsForm.get('boardDimension'),
      this.settingsForm.get('numberOfBombs')
    ].map(input => input.valueChanges
      .subscribe(() => {
        this.updateSelect();
        this.inputValidation();
      })
    );

    this.settingsForm.get('boardDimension').setValidators([
      Validators.required, Validators.min(1), Validators.max(50)
    ]);

    // Slider
    this.fieldSizeService.fieldSize
      .subscribe(fieldSize => this.fieldSize = fieldSize);

    this.newGameEvent.emit(this.settingsForm.value);
  }

  public onCheckboxAction(): void {
    const state = this.shouldCloseSidenav.toString();
    localStorage.setItem('shouldCloseSidenav', state);
  }

  // Save newest difficulty setting and emit events
  public onSubmit(): void {
    const difficulty: Difficulty = new Difficulty(
      this.settingsForm.get('name').value,
      this.settingsForm.get('boardDimension').value,
      this.settingsForm.get('numberOfBombs').value
    );
    localStorage.setItem('difficulty', JSON.stringify(difficulty));

    this.newGameEvent.emit(difficulty);
    if (this.shouldCloseSidenav) {
      this.closeSidenav.emit();
    }
  }

}
