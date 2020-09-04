import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BoardComponent } from './board.component';
import { SettingsService } from 'src/app/services/settings.service';
import { DifficultyService } from 'src/app/services/difficulty.service';
import { ChangeDetectorRef } from '@angular/core';
import { FlagService } from 'src/app/services/flag.service';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { Difficulty } from 'src/app/difficulty';
import { PrintFieldPipe } from 'src/app/pipes/print-field.pipe';

class SettingsServiceStub implements Partial<SettingsService> {
  public fieldSize = new BehaviorSubject<number>(30);
  public setFieldSize = (n: number): void => this.fieldSize.next(n);
}
const settingsServiceStub = new SettingsServiceStub();

class DifficultyServiceStub implements Partial<DifficultyService> {
  public initialDifficulty = new Difficulty(7, 7);
  public difficulty = new BehaviorSubject<Difficulty>(this.initialDifficulty);
  public newDifficulty = (d: Difficulty): void => this.difficulty.next(d);
}
const difficultyServiceStub = new DifficultyServiceStub();

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BoardComponent,
        PrintFieldPipe
      ],
      providers: [
        { provide: MatSnackBar, useValue: { dismiss: () => {} }},
        { provide: SettingsService, useValue: settingsServiceStub },
        { provide: DifficultyService, difficultyServiceStub },
        { provide: FlagService },
        { provide: ChangeDetectorRef }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update field size', () => {
    const settingsService = TestBed.inject(SettingsService);
    settingsService.setFieldSize(42);

    component.ngOnInit();
    expect(component.fieldSize).toBe(42);

    fixture.detectChanges();
    const styles = fixture.debugElement
      .query(By.css('.board-container'))
      .styles;

    expect(styles.minWidth).toBe('42px');
    expect(styles.minHeight).toBe(styles.minWidth);
  });

  it('should properly generate new board with initial difficulty', () => {
    const difficultyService = TestBed.inject(DifficultyService);

    component.ngOnInit();
    const generatedFieldsDimension = component.board.fields.length;
    const expectedFieldDimension =
      difficultyService.initialDifficulty.boardDimension;
    expect(generatedFieldsDimension).toBe(expectedFieldDimension);

    const generatedNumberOfBombs = component.board.getFlagCounter();
    const expectedNumberOfBombs =
      difficultyService.initialDifficulty.numberOfBombs;
    expect(generatedNumberOfBombs).toBe(expectedNumberOfBombs);
  });

  it('should properly render board as HTML', () => {
    const difficultyService = TestBed.inject(DifficultyService);
    const expectedDimension = difficultyService.initialDifficulty.boardDimension;

    component.ngOnInit();
    fixture.detectChanges();
    const boardContainer = fixture.debugElement.query(By.css('.board-container'));
    const rowContainers = boardContainer.children;

    expect(rowContainers.length).toBe(expectedDimension);

    rowContainers.forEach(rowContainer => expect(rowContainer.children.length)
      .toBe(expectedDimension));
  });

  // it('should handle click events', () => {});
  // it('should handle rigth click events', () => {});
  // it('should handle every game state', () => {});
  // it('should spawn snack bars', () => {});
  // it('should dismiss snack bars', () => {});
});
