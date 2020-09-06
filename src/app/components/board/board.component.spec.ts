import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';

import { BoardComponent } from './board.component';
import { SettingsService } from 'src/app/services/settings.service';
import { DifficultyService } from 'src/app/services/difficulty.service';
import { FlagService } from 'src/app/services/flag.service';
import { BehaviorSubject, of } from 'rxjs';
import { Difficulty } from 'src/app/classes/difficulty';
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
        { provide: MatSnackBar, useValue: {
          open: (message: string,
                 action: string,
                 config: MatSnackBarConfig) => {
            return { onAction: () => of() };
          },
          dismiss: () => {} }},
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

    const generatedNumberOfBombs = component.board.flagCounter;
    const expectedNumberOfBombs =
      difficultyService.initialDifficulty.numberOfBombs;
    expect(generatedNumberOfBombs).toBe(expectedNumberOfBombs);
  });

  it('should properly render board as HTML', () => {
    const difficultyService = TestBed.inject(DifficultyService);
    const expectedDimension = difficultyService.initialDifficulty.boardDimension;

    component.ngOnInit();
    fixture.detectChanges();
    const boardContainer = fixture.debugElement.query(
      By.css('.board-container')
    );

    const rowContainers = boardContainer.children;

    expect(rowContainers.length).toBe(expectedDimension);

    rowContainers.forEach(rowContainer => expect(rowContainer.children.length)
      .toBe(expectedDimension)
    );
  });

  it('should handle click events', () => {
    component.ngOnInit();

    const clicked = component.board.fields[0][0];
    component.onClick(clicked);

    expect(clicked.isChecked).toBe(true);
  });

  it('should show hints on checked buttons', () => {
    component.ngOnInit();
    const difficultyService = TestBed.inject(DifficultyService);
    difficultyService.newDifficulty(new Difficulty(5, 24));
    fixture.detectChanges();

    const clicked = component.board.fields[0][0];
    component.onClick(clicked);
    expect(clicked.value).toBe(3);

    fixture.detectChanges();

    const clickedButton = fixture.debugElement
      .query(By.css('.field')).nativeElement as HTMLButtonElement;
    expect(clickedButton.innerHTML).toContain('3');
  });

  it('should set flagService counter on new game', () => {
    const flagService = TestBed.inject(FlagService);
    const difficultyService = TestBed.inject(DifficultyService);

    difficultyService.newDifficulty(new Difficulty(5, 5));
    component.ngOnInit();

    flagService.counter.subscribe(counter => expect(counter).toBe(5))
      .unsubscribe();
  });

  it('should handle right click events', () => {
    const difficultyService = TestBed.inject(DifficultyService);
    difficultyService.newDifficulty(new Difficulty(3, 3));
    component.ngOnInit();
    fixture.detectChanges();

    const flagged = component.board.fields[0][0];
    component.onRightClick(flagged);
    expect(flagged.isFlagged).toBe(true);

    fixture.detectChanges();

    const flaggedButton = fixture.debugElement
      .query(By.css('.field')).nativeElement as HTMLButtonElement;
    const buttonContent = flaggedButton.firstChild as HTMLElement;

    expect(buttonContent.classList).toContain('material-icons');
  });

  it('should update flagService counter', () => {
    const flagService = TestBed.inject(FlagService);
    const difficultyService = TestBed.inject(DifficultyService);

    difficultyService.newDifficulty(new Difficulty(4, 4));
    component.ngOnInit();
    const flagged = component.board.fields[0][0];
    component.onRightClick(flagged);

    flagService.counter.subscribe(counter => expect(counter).toBe(3))
      .unsubscribe();
  });

  // it('should spawn game won snack bar', () => {});
  // it('should spawn game lost snack bar', () => {});
  // it('should not spawn snack bar when game continues', () => {});
  // it('should dismiss snack bars', () => {});
});
