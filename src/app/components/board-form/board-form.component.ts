import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { Difficulty, NamedDifficulty } from 'src/app/classes/difficulty';
import { DifficultyService } from 'src/app/services/difficulty.service';

@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.scss']
})
export class BoardFormComponent implements OnInit {
  @Output()
  public readonly formSubmitEvent = new EventEmitter<void>();

  public readonly boardForm = this.formBuilder.group(
    NamedDifficulty.matchToPreset(this.difficultyService.initial),
    { validator: this.boardFormValidator });

  public readonly name = this.boardForm.get('name');
  public readonly boardDimension = this.boardForm.get('boardDimension');
  public readonly numberOfBombs = this.boardForm.get('numberOfBombs');

  public readonly maxBoardDimension = Difficulty.maxBoardDimension;
  public readonly presetList = [
    NamedDifficulty.custom, ...NamedDifficulty.presets
  ];
  public readonly presetNames = this.presetList.map(preset => preset.name);

  constructor(
    public formBuilder: FormBuilder,
    private difficultyService: DifficultyService) { }

  private boardFormValidator(fg: FormGroup): ValidationErrors {
    if (fg.get('boardDimension').invalid) {
      fg.get('numberOfBombs').setErrors({ undefinedDimension: true });
    } else { return null; }
  }

  public getNumberOfBombsError(): string {
    if (this.boardDimension.invalid) {
      return 'Board dimension must be valid';
    } else if (this.boardDimension.value === 1) {
      return 'Must be 0';
    } else {
      return `Must be between 0 and ${this.getMaxNumberOfBombs()}`;
    }
  }

  public getMaxNumberOfBombs(): number {
    return this.boardDimension.value ** 2 - 1;
  }

  public onSubmit(): void {
    if (this.boardForm.valid) {
      this.difficultyService.newDifficulty(this.boardForm.value);
      this.formSubmitEvent.emit();
    }
  }

  public ngOnInit(): void {
    this.setupFormSubscriptions();
    this.setBoardDimensionValidators();

    // Untouched inputs doesn't show if they are invalid
    this.boardForm.markAllAsTouched();
  }

  private setupFormSubscriptions(): void {
    this.name.valueChanges.subscribe(() => this.updateInputValues());
    this.numberOfBombs.valueChanges.subscribe(() => this.updatePresetName());
    this.boardDimension.valueChanges.subscribe(() => this.updatePresetName());
  }

  private updateInputValues(): void {
    const preset = this.getSelectedPreset();
    this.setInputsToValuesFrom(preset);
    this.resetNumberOfBombsValidators();
  }

  private updatePresetName(): void {
    this.matchAndSetPresetName();
    this.resetNumberOfBombsValidators();
  }

  private getSelectedPreset(): NamedDifficulty {
    const selectedName = this.name.value;
    return this.presetList.find(preset => preset.name === selectedName);
  }

  private matchAndSetPresetName(): void {
    this.boardForm.updateValueAndValidity({ emitEvent: false });

    const formDifficulty = this.boardForm.value;
    const matched = NamedDifficulty.matchToPreset(formDifficulty);

    this.boardForm.patchValue({ name: matched.name }, { emitEvent: false });
  }

  private resetNumberOfBombsValidators(): void {
    this.numberOfBombs.setValidators([
      Validators.required, Validators.min(0),
      Validators.max(this.getMaxNumberOfBombs())
    ]);

    this.updateInputsValueAndValidity();
  }

  private updateInputsValueAndValidity(): void {
    this.boardDimension.updateValueAndValidity({ emitEvent: false });
    this.numberOfBombs.updateValueAndValidity({ emitEvent: false });
  }

  private setInputsToValuesFrom(preset: NamedDifficulty): void {
    if (preset !== NamedDifficulty.custom) {
      this.boardForm.patchValue({
        boardDimension: preset.boardDimension,
        numberOfBombs: preset.numberOfBombs
      }, { emitEvent: false });
    }
  }

  private setBoardDimensionValidators(): void {
    this.boardDimension.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(this.maxBoardDimension)
    ]);
  }
}
