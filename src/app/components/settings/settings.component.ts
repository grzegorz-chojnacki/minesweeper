import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup,
         ValidationErrors } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';

import { Difficulty, difficulties,
         customDifficulty, NamedDifficulty } from 'src/app/classes/difficulty';
import { DifficultyService } from 'src/app/services/difficulty.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Output() public formSubmitEvent = new EventEmitter<void>();
  public fieldSize: number;
  public sidenavAutoHide: boolean;

  public difficultyList = [customDifficulty, ...difficulties];
  public difficultyNames = this.difficultyList
    .map(difficulty => difficulty.name);

  public settingsForm = this.formBuilder.group(
    Difficulty.matchToPreset(this.difficultyService.initialDifficulty),
    { validator: this.settingsFormValidator }
  );
  public maxNumberOfBombs = this.getMaxNumberOfBombs();
  public maxBoardDimension = Difficulty.maxBoardDimension;

  constructor(
    public formBuilder: FormBuilder,
    public settingsService: SettingsService,
    private difficultyService: DifficultyService) { }

  public onFieldSizeChange(event: MatSliderChange): void {
    this.settingsService.setFieldSize(event.value);
  }

  // Try to match difficulty preset with boardDimension & numberOfBombs values
  private updateSelect(): void {
    const formDifficulty = this.getSettingsFormValue();

    const matched = Difficulty.matchToPreset(formDifficulty);

    this.settingsForm.patchValue({ name: matched.name }, { emitEvent: false });
  }

  private getSettingsFormValue(): NamedDifficulty {
    return {
      name: this.settingsForm.get('name').value,
      boardDimension: this.settingsForm.get('boardDimension').value,
      numberOfBombs: this.settingsForm.get('numberOfBombs').value,
    };
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
    } else {
      return `Must be between 0 and ${this.maxNumberOfBombs}`;
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

    // Settings
    this.settingsService.fieldSize
      .subscribe(fieldSize => this.fieldSize = fieldSize);

    this.settingsService.sidenavAutoHide
      .subscribe(sidenavAutoHide => this.sidenavAutoHide = sidenavAutoHide);
  }

  public ngOnInit(): void {
    this.setupSubscriptions();
    // boardDimension validators (numberOfBombs validators are based
    // on boardDimension, so they are added/updated in `this.refreshValidators`)
    this.settingsForm.get('boardDimension').setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(this.maxBoardDimension)
    ]);
    // Untouched inputs doesn't show if they are invalid
    this.settingsForm.markAllAsTouched();
  }

  public onCheckboxChange(): void {
    this.settingsService.setSidenavAutoHide(this.sidenavAutoHide);
  }

  // Start new game (restart) and close sidenav if specified
  public onSubmit(): void {
    if (this.settingsForm.valid) {
      this.difficultyService.newDifficulty(this.settingsForm.value);
      this.formSubmitEvent.emit();
    }
  }

}
