import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { Difficulty, difficulties, customDifficulty } from '../../difficulty';
import { FieldSizeService } from '../../services/field-size.service';
import { DifficultyService } from '../../services/difficulty.service';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Output() public closeSidenav = new EventEmitter<void>();
  public fieldSize: number;
  public shouldCloseSidenav =
    (localStorage.getItem('shouldCloseSidenav') !== null)
    ? localStorage.getItem('shouldCloseSidenav') === 'true'
    : true; // Initialize to true if this item is undefined

  public difficultyList = [customDifficulty, ...difficulties];
  public difficultyNames = this.difficultyList
    .map(difficulty => difficulty.name);

  public settingsForm = this.formBuilder.group(
    this.difficultyService.initialDifficulty,
    { validator: this.settingsFormValidator }
  );
  public maxNumberOfBombs = this.getMaxNumberOfBombs();

  constructor(
    public formBuilder: FormBuilder,
    public fieldSizeService: FieldSizeService,
    private difficultyService: DifficultyService) { }

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

  private setupSubscriptions(): void {
    // Select
    this.settingsForm.get('name').valueChanges
      .subscribe(() => {
        this.updateInputs();
        this.refreshValidators();
      });

    // Inputs
    [this.settingsForm.get('boardDimension'),
     this.settingsForm.get('numberOfBombs')]
    .map(input => input.valueChanges
      .subscribe(() => {
        this.updateSelect();
        this.refreshValidators();
    }));

    // Slider
    this.fieldSizeService.fieldSize
      .subscribe(fieldSize => this.fieldSize = fieldSize);
  }

  // Setup form and slider control
  public ngOnInit(): void {
    this.setupSubscriptions();
    // boardDimension validators (numberOfBombs validators are based
    // on boardDimension, so they are added/updated in `this.refreshValidators`)
    this.settingsForm.get('boardDimension').setValidators([
      Validators.required, Validators.min(1), Validators.max(50)
    ]);
    // Untouched inputs doesn't show if they are invalid
    this.settingsForm.markAllAsTouched();
  }

  public onCheckboxChange(): void {
    const state = this.shouldCloseSidenav.toString();
    localStorage.setItem('shouldCloseSidenav', state);
  }

  // Start new game (restart) and close sidenav if specified
  public onSubmit(): void {
    this.difficultyService.newDifficulty(this.settingsForm.value);

    if (this.shouldCloseSidenav) {
      this.closeSidenav.emit();
    }
  }

}
