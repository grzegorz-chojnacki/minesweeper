import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { BombPercentagePipe } from 'src/app/pipes/bomb-percentage.pipe';
import { DifficultyService } from 'src/app/services/difficulty.service';
import { Difficulty, NamedDifficulty } from 'src/app/classes/difficulty';
import { BoardFormComponent } from './board-form.component';
import { FakeStorage } from 'src/app/services/fakeStorage';

describe('BoardFormComponent', () => {
  let component: BoardFormComponent;
  let fixture: ComponentFixture<BoardFormComponent>;

  beforeEach(async(() => {
    const difficultyServiceStub = new DifficultyService(new FakeStorage());

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
      ],
      declarations: [
        BoardFormComponent,
        BombPercentagePipe
      ],
      providers: [
        { provide: FormBuilder },
        { provide: DifficultyService, useValue: difficultyServiceStub }
      ]
    }).compileComponents()
      .then(() => {
      fixture = TestBed.createComponent(BoardFormComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => component.ngOnDestroy());

  describe('Initialization behaviour', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have full list of difficulty names', () => {
      component.ngOnInit();

      const presetNamesLength = component.presetNames.length;
      const expectedLength = [
        NamedDifficulty.custom, ...NamedDifficulty.presets
      ].length;

      expect(presetNamesLength).toBe(expectedLength);
    });

    it('should init inputs with initial values', () => {
      const difficultyService = TestBed.inject(DifficultyService);
      const expected = difficultyService.initial;

      component.ngOnInit();

      const difficulty: Difficulty = component.boardForm.value;
      expect(difficulty.boardDimension).toEqual(expected.boardDimension);
      expect(difficulty.numberOfBombs).toEqual(expected.numberOfBombs);
    });
  });

  describe('Form validation behaviour', () => {
    it('should mark number of bombs as invalid if value is below 0', () => {
      component.ngOnInit();
      component.boardForm
        .patchValue({ boardDimension: 1, numberOfBombs: -1 });

      expect(component.numberOfBombsInput.invalid).toBe(true);
    });

    it('should mark number of bombs as invalid if value is above/eq max', () => {
      component.ngOnInit();
      component.boardForm
        .patchValue({ boardDimension: 1, numberOfBombs: 1 });

      expect(component.numberOfBombsInput.invalid).toBe(true);
    });

    it('should mark number of bombs as invalid if board dimension is invalid', () => {
      component.ngOnInit();
      component.boardForm
        .patchValue({ boardDimension: 0, numberOfBombs: 1 });

      expect(component.numberOfBombsInput.invalid).toBe(true);
    });

    it('should mark board dimension as invalid if value is below/eq 0', () => {
      component.ngOnInit();
      component.boardForm
        .patchValue({ boardDimension: 0, numberOfBombs: 1 });

      expect(component.boardDimensionInput.invalid).toBe(true);
    });

    it('should mark board dimension as invalid if value is above max', () => {
      component.ngOnInit();
      component.boardForm.patchValue({
        boardDimension: Difficulty.maxBoardDimension + 1,
        numberOfBombs: 1
      });

      expect(component.boardDimensionInput.invalid).toBe(true);
    });
  });

  describe('Number of bombs error generator behaviour', () => {
    it('should return board dimension error', () => {
      component.ngOnInit();
      component.boardForm.patchValue({ boardDimension: 0 });

      const error = component.getNumberOfBombsError();
      expect(error).toContain('dimension');
    });

    it('should return number of bombs error when bombs are unset', () => {
      component.ngOnInit();
      component.boardForm
        .patchValue({ boardDimension: 2, numberOfBombs: undefined });

      const error = component.getNumberOfBombsError();
      expect(error).toContain('between 0 and 3');
    });

    it('should return number of bombs out of bounds error when below 0', () => {
      component.ngOnInit();
      component.boardForm
        .patchValue({ boardDimension: 2, numberOfBombs: -1 });

      const error = component.getNumberOfBombsError();
      expect(error).toContain('between 0 and 3');
    });

    it('should return number of bombs out of bounds error when above max', () => {
      component.ngOnInit();
      component.boardForm
        .patchValue({ boardDimension: 2, numberOfBombs: 4 });

      const error = component.getNumberOfBombsError();
      expect(error).toContain('between 0 and 3');
    });

    it('should return number of bombs error when it can only be set to 1', () => {
      component.ngOnInit();
      component.boardForm
        .patchValue({ boardDimension: 1, numberOfBombs: 1 });

      const error = component.getNumberOfBombsError();
      expect(error).toContain('Must be 0');
    });
  });

  describe('Form submition behaviour', () => {
    it('should prevent form submition if it is invalid', () => {
      const difficultyService = TestBed.inject(DifficultyService);
      spyOn(difficultyService, 'newDifficulty').and.callThrough();
      component.ngOnInit();

      component.boardForm
        .patchValue({ boardDimension: 10, numberOfBombs: 100 });

      component.onSubmit();
      expect(difficultyService.newDifficulty).not.toHaveBeenCalled();
    });

    it('should set new difficulty on form submit', () => {
      const difficultyService = TestBed.inject(DifficultyService);
      const expected = new Difficulty(13, 37);
      component.ngOnInit();

      component.boardForm.patchValue({
        boardDimension: expected.boardDimension,
        numberOfBombs: expected.numberOfBombs
      });

      component.onSubmit();
      difficultyService.difficulty.subscribe(difficulty => {
        expect(difficulty.boardDimension).toEqual(expected.boardDimension);
        expect(difficulty.numberOfBombs).toEqual(expected.numberOfBombs);
      }).unsubscribe();
    });

    it('should emit event on form submit', () => {
      spyOn(component.formSubmitEvent, 'emit');
      component.ngOnInit();
      component.boardForm
        .patchValue({ boardDimension: 1, numberOfBombs: 0 });

      component.onSubmit();
      expect(component.formSubmitEvent.emit).toHaveBeenCalled();
    });
  });

  describe('Form fields synchronization behaviour', () => {
    it('should set select to custom preset if it does not match any', () => {
      component.ngOnInit();
      component.boardForm
        .patchValue({ boardDimension: 1, numberOfBombs: 0 });

      const selectedOption = component.nameSelect.value;
      expect(selectedOption).toBe(NamedDifficulty.custom.name);
    });

    it('should set preset name to matched preset', () => {
      component.ngOnInit();
      component.boardForm.patchValue({ boardDimension: 1, numberOfBombs: 0 });

      const example = NamedDifficulty.initial;
      component.boardForm.patchValue({
        boardDimension: example.boardDimension,
        numberOfBombs: example.numberOfBombs
      });

      const selectedPreset = component.nameSelect.value;
      expect(selectedPreset).toBe(example.name);
    });

    it('should set inputs to values from selected preset', () => {
      component.ngOnInit();
      const example = NamedDifficulty.presets[1];
      component.boardForm.patchValue({ name: example.name });

      const boardDimension = component.boardDimensionInput.value;
      const numberOfBombs = component.numberOfBombsInput.value;
      expect(boardDimension).toBe(example.boardDimension);
      expect(numberOfBombs).toBe(example.numberOfBombs);
    });

    it('should not change inputs when selecting custom difficulty', () => {
      component.ngOnInit();
      const example = NamedDifficulty.presets[1];
      component.boardForm.patchValue({
        boardDimension: example.boardDimension,
        numberOfBombs: example.numberOfBombs
      });

      component.boardForm.patchValue({
        name: NamedDifficulty.custom.name,
      });

      const form = component.boardForm.value;
      expect(form.boardDimension).toBe(example.boardDimension);
      expect(form.numberOfBombs).toBe(example.numberOfBombs);
      expect(form.name).toBe(NamedDifficulty.custom.name);
    });
  });
});
