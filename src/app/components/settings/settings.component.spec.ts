import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { SettingsComponent } from './settings.component';
import { SettingsService } from 'src/app/services/settings.service';
import { DifficultyService } from 'src/app/services/difficulty.service';
import { BombPercentagePipe } from 'src/app/pipes/bomb-percentage.pipe';
import { Difficulty, NamedDifficulty } from 'src/app/classes/difficulty';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

class SettingsServiceStub implements Partial<SettingsService> {
  public readonly minFieldSize = 30;
  public readonly maxFieldSize = 60;
  public fieldSize = new BehaviorSubject<number>(this.minFieldSize);
  public sidenavAutoHide = new BehaviorSubject<boolean>(true);

  public setFieldSize = (n: number): void => this.fieldSize.next(n);
  public setSidenavAutoHide = (b: boolean): void =>
    this.sidenavAutoHide.next(b)
}
const settingsServiceStub = new SettingsServiceStub();

class DifficultyServiceStub implements Partial<DifficultyService> {
  public initial = new Difficulty(7, 7);
  public difficulty = new BehaviorSubject<Difficulty>(this.initial);
  public newDifficulty = (d: Difficulty): void => this.difficulty.next(d);
}
const difficultyServiceStub = new DifficultyServiceStub();

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatInputModule,
        MatDividerModule,
        MatSliderModule,
        MatFormFieldModule,
        MatSelectModule
      ],
      declarations: [
        SettingsComponent,
        BombPercentagePipe
      ],
      providers: [
        { provide: FormBuilder },
        { provide: SettingsService, useValue: settingsServiceStub },
        { provide: DifficultyService, useValue: difficultyServiceStub }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
    });
  }));

  describe('Initialization behaviour', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have full list of difficulty names', () => {
      component.ngOnInit();

      const difficultyNamesLength = component.presetNames.length;
      const expectedLength = [
        NamedDifficulty.custom, ...NamedDifficulty.presets
      ].length;

      expect(difficultyNamesLength).toBe(expectedLength);
    });

    it('should init field size value', () => {
      const settingsService = TestBed.inject(SettingsService);
      settingsService.setFieldSize(42);

      component.ngOnInit();

      expect(component.fieldSize).toBe(42);
    });

    it('should init field size slider value', () => {
      const settingsService = TestBed.inject(SettingsService);
      settingsService.setFieldSize(32);
      fixture.detectChanges();

      component.ngOnInit();

      const slider = fixture.debugElement
        .query(By.css('mat-slider')).attributes;

      expect(slider['ng-reflect-value']).toBe('32');
    });

    it('should init inputs with initial values', () => {
      const difficultyService = TestBed.inject(DifficultyService);
      const expected = difficultyService.initial;

      component.ngOnInit();

      const difficulty: Difficulty = component.settingsForm.value;
      expect(difficulty.boardDimension).toEqual(expected.boardDimension);
      expect(difficulty.numberOfBombs).toEqual(expected.numberOfBombs);
    });

    it('should init sidenav auto hide setting', () => {
      const settingsService = TestBed.inject(SettingsService);
      settingsService.setSidenavAutoHide(false);

      component.ngOnInit();

      expect(component.sidenavAutoHide).toBe(false);
    });
  });

  describe('Form validation behaviour', () => {
    it('should mark number of bombs as invalid if value is below 0', () => {
      component.ngOnInit();
      component.settingsForm
        .patchValue({ boardDimension: 1, numberOfBombs: -1 });

      const numberOfBombs = component.settingsForm.get('numberOfBombs');
      expect(numberOfBombs.invalid).toBe(true);
    });

    it('should mark number of bombs as invalid if value is above/eq max', () => {
      component.ngOnInit();
      component.settingsForm
        .patchValue({ boardDimension: 1, numberOfBombs: 1 });

      const numberOfBombs = component.settingsForm.get('numberOfBombs');
      expect(numberOfBombs.invalid).toBe(true);
    });

    it('should mark number of bombs as invalid if board dimension is invalid', () => {
      component.ngOnInit();
      component.settingsForm
        .patchValue({ boardDimension: 0, numberOfBombs: 1 });

      const numberOfBombs = component.settingsForm.get('numberOfBombs');
      expect(numberOfBombs.invalid).toBe(true);
    });

    it('should mark board dimension as invalid if value is below/eq 0', () => {
      component.ngOnInit();
      component.settingsForm
        .patchValue({ boardDimension: 0, numberOfBombs: 1 });

      const boardDimension = component.settingsForm.get('boardDimension');
      expect(boardDimension.invalid).toBe(true);
    });

    it('should mark board dimension as invalid if value is above max', () => {
      component.ngOnInit();
      component.settingsForm.patchValue({
        boardDimension: Difficulty.maxBoardDimension + 1,
        numberOfBombs: 1
      });

      const boardDimension = component.settingsForm.get('boardDimension');
      expect(boardDimension.invalid).toBe(true);
    });
  });

  describe('Error generator behaviour', () => {
    it('should return board dimension error', () => {
      component.ngOnInit();
      component.settingsForm.patchValue({ boardDimension: 0 });

      const error = component.getNumberOfBombsError();
      expect(error).toContain('dimension');
    });

    it('should return number of bombs error when bombs are unset', () => {
      component.ngOnInit();
      component.settingsForm
        .patchValue({ boardDimension: 2, numberOfBombs: undefined });

      const error = component.getNumberOfBombsError();
      expect(error).toContain('between 0 and 3');
    });

    it('should return number of bombs out of bounds error when below 0', () => {
      component.ngOnInit();
      component.settingsForm
        .patchValue({ boardDimension: 2, numberOfBombs: -1 });

      const error = component.getNumberOfBombsError();
      expect(error).toContain('between 0 and 3');
    });

    it('should return number of bombs out of bounds error when above max', () => {
      component.ngOnInit();
      component.settingsForm
        .patchValue({ boardDimension: 2, numberOfBombs: 4 });

      const error = component.getNumberOfBombsError();
      expect(error).toContain('between 0 and 3');
    });

    it('should return number of bombs error when it can only be set to 1', () => {
      component.ngOnInit();
      component.settingsForm
        .patchValue({ boardDimension: 1, numberOfBombs: 1 });

      const error = component.getNumberOfBombsError();
      expect(error).toContain('Must be 0');
    });
  });

  describe('Template behaviour', () => {
    it('should show field px size, in field size label', () => {
      const settingsService = TestBed.inject(SettingsService);
      settingsService.setFieldSize(31);
      fixture.detectChanges();

      component.ngOnInit();

      const label: HTMLElement = fixture.debugElement
        .query(By.css('.field-size-label')).nativeElement;

      expect(label.innerHTML).toBe('31 px');
    });
  });

  describe('Data propagation behaviour', () => {
    it('should update field size on slider change event', () => {
      const settingsService = TestBed.inject(SettingsService);

      component.ngOnInit();
      component.onFieldSizeChange({ source: null, value: 44 });

      settingsService.fieldSize
        .subscribe(fieldSize => expect(fieldSize).toBe(44))
        .unsubscribe();
    });

    it('should prevent form submition if it is invalid', () => {
      const difficultyService = TestBed.inject(DifficultyService);
      spyOn(difficultyService, 'newDifficulty').and.callThrough();
      component.ngOnInit();

      component.settingsForm
        .patchValue({ boardDimension: 10, numberOfBombs: 100 });

      component.onSubmit();
      expect(difficultyService.newDifficulty).not.toHaveBeenCalled();
    });

    it('should set new difficulty on form submit', () => {
      const difficultyService = TestBed.inject(DifficultyService);
      const expected = new Difficulty(13, 37);
      component.ngOnInit();

      component.settingsForm.patchValue({
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
      component.settingsForm
        .patchValue({ boardDimension: 1, numberOfBombs: 0 });

      component.onSubmit();
      expect(component.formSubmitEvent.emit).toHaveBeenCalled();
    });

    it('should update sidenav auto hide setting', () => {
      const settingsService = TestBed.inject(SettingsService);
      spyOn(settingsService, 'setSidenavAutoHide');

      component.ngOnInit();
      component.onCheckboxChange();

      expect(settingsService.setSidenavAutoHide).toHaveBeenCalled();
    });
  });

  describe('Form fields synchronization behaviour', () => {
    it('should set select to custom preset if it does not match any', () => {
      component.ngOnInit();
      component.settingsForm
        .patchValue({ boardDimension: 1, numberOfBombs: 0 });

      const selectedOption = component.settingsForm.get('name').value;
      expect(selectedOption).toBe(NamedDifficulty.custom.name);
    });

    it('should set preset name to matched preset', () => {
      component.ngOnInit();
      const example = NamedDifficulty.presets[1];
      component.settingsForm.patchValue({
        boardDimension: example.boardDimension,
        numberOfBombs: example.numberOfBombs
      });

      const selectedPreset = component.settingsForm.get('name').value;
      expect(selectedPreset).toBe(example.name);
    });

    it('should set inputs to values from selected preset', () => {
      component.ngOnInit();
      const example = NamedDifficulty.presets[1];
      component.settingsForm.patchValue({ name: example.name });

      const boardDimension = component.settingsForm.get('boardDimension').value;
      const numberOfBombs = component.settingsForm.get('numberOfBombs').value;
      expect(boardDimension).toBe(example.boardDimension);
      expect(numberOfBombs).toBe(example.numberOfBombs);
    });

    it('should not change inputs upon selecting custom difficulty', () => {
      component.ngOnInit();
      const example = NamedDifficulty.presets[1];
      component.settingsForm.patchValue({
        boardDimension: example.boardDimension,
        numberOfBombs: example.numberOfBombs
      });

      component.settingsForm.patchValue({
        name: NamedDifficulty.custom.name,
      });

      const form = component.settingsForm.value;
      expect(form.boardDimension).toBe(example.boardDimension);
      expect(form.numberOfBombs).toBe(example.numberOfBombs);
      expect(form.name).toBe(NamedDifficulty.custom.name);
    });
  });
});
