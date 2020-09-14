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
  @Output() public formSubmitEvent = new EventEmitter<void>();

  public boardForm = this.formBuilder.group(
    NamedDifficulty.matchToPreset(this.difficultyService.initial),
    { validator: this.boardFormValidator });

  public presetList = [NamedDifficulty.custom, ...NamedDifficulty.presets];
  public presetNames = this.presetList.map(preset => preset.name);

  public maxNumberOfBombs = this.getMaxNumberOfBombs();
  public maxBoardDimension = Difficulty.maxBoardDimension;

  constructor(
    public formBuilder: FormBuilder,
    private difficultyService: DifficultyService) { }

  private boardFormValidator(fg: FormGroup): ValidationErrors {
    if (fg.get('boardDimension').invalid) {
      fg.get('numberOfBombs').setErrors({ undefinedDimension: true });
    } else { return null; }
  }

  public getNumberOfBombsError(): string {
    if (this.boardForm.get('boardDimension').invalid) {
      return 'Board dimension must be valid';
    } else if (this.boardForm.get('boardDimension').value === 1) {
      return 'Must be 0';
    } else {
      return `Must be between 0 and ${this.maxNumberOfBombs}`;
    }
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
    const nameInput = this.boardForm.get('name');
    const valueInputs = [
      this.boardForm.get('boardDimension'),
      this.boardForm.get('numberOfBombs')
    ];

    nameInput.valueChanges.subscribe(() => {
      const preset = this.getSelectedPreset();
      this.setPresetValues(preset);
      this.resetNumberOfBombsValidators();
    });

    valueInputs.forEach(input =>
      input.valueChanges.subscribe(() => {
        this.resetNumberOfBombsValidators();
        this.matchAndSetPresetName();
      })
    );
  }

  private getSelectedPreset(): NamedDifficulty {
    const selectedName = this.boardForm.get('name').value;
    return this.presetList.find(preset => preset.name === selectedName);
  }

  private matchAndSetPresetName(): void {
    this.boardForm.updateValueAndValidity({ emitEvent: false });

    const formDifficulty = this.boardForm.value;
    const matched = NamedDifficulty.matchToPreset(formDifficulty);

    this.boardForm.patchValue({ name: matched.name }, { emitEvent: false });
  }

  private resetNumberOfBombsValidators(): void {
    this.maxNumberOfBombs = this.getMaxNumberOfBombs();

    this.boardForm.get('numberOfBombs').setValidators([
      Validators.required, Validators.min(0),
      Validators.max(this.maxNumberOfBombs)
    ]);

    this.boardForm.get('boardDimension')
      .updateValueAndValidity({ emitEvent: false });
    this.boardForm.get('numberOfBombs')
      .updateValueAndValidity({ emitEvent: false });
  }

  private getMaxNumberOfBombs(): number {
    return this.boardForm.get('boardDimension').value ** 2 - 1;
  }

  private setPresetValues(preset: NamedDifficulty): void {
    if (preset !== NamedDifficulty.custom) {
      this.boardForm.patchValue({
        boardDimension: preset.boardDimension,
        numberOfBombs: preset.numberOfBombs
      }, { emitEvent: false });
    }
  }

  private setBoardDimensionValidators(): void {
    this.boardForm.get('boardDimension').setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(this.maxBoardDimension)
    ]);
  }
}
