import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ValidationErrors } from '@angular/forms';
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
    (localStorage.getItem('shouldCloseSidenav') !== null)
    ? localStorage.getItem('shouldCloseSidenav') === 'true'
    : true; // Initialize to true if this item is undefined


  public difficultyList = [customDifficulty, ...difficulties];
  public difficultyNames = this.difficultyList
    .map(difficulty => difficulty.name);

  public settingsForm = this.formBuilder.group(
    JSON.parse(localStorage.getItem('difficulty')) || difficulties[0],
    { validator: this.settingsFormValidator }
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

  // Indicate error on both inputs, when boarDimension is invalid
  private settingsFormValidator(fg: FormGroup): ValidationErrors {
    if (fg.get('boardDimension').invalid) {
      fg.get('numberOfBombs').setErrors({ undefinedDimension: true });
    } else {
      return null;
    }
  }

  // Dynamic error messages
  public getNumberOfBombsError(): string {
    if (this.settingsForm.get('boardDimension').invalid) {
      return 'Board dimension must be valid';
    } else if (this.settingsForm.get('boardDimension').value === 1) {
      return 'Must be 0';
    } else if (this.settingsForm.get('numberOfBombs').value > 0) {
      return `Must be between 0 and ${this.maxNumberOfBombs}`;
    } else {
      return 'Cannot be negative';
    }
  }

  private refreshValidators(): void {
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
      .subscribe(() => {
        this.updateInputs();
        this.refreshValidators();
      });

    // Inputs
    [
      this.settingsForm.get('boardDimension'),
      this.settingsForm.get('numberOfBombs')
    ].map(input => input.valueChanges
      .subscribe(() => {
        this.updateSelect();
        this.refreshValidators();
      })
    );

    // boardDimension validators (numberOfBombs validators are based
    // on boardDimension, so they are added/updated in `this.refreshValidators`)
    this.settingsForm.get('boardDimension').setValidators([
      Validators.required, Validators.min(1), Validators.max(50)
    ]);
    // Untouched inputs doesn't show if they are invalid
    this.settingsForm.markAllAsTouched();

    // Slider
    this.fieldSizeService.fieldSize
      .subscribe(fieldSize => this.fieldSize = fieldSize);

    this.newGameEvent.emit(this.settingsForm.value);
  }

  public onCheckboxChange(): void {
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
