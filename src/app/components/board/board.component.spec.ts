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
import { Board } from 'src/app/classes/board';
import { FakeBombPlanter } from 'src/app/classes/bombPlanter';
import { Field } from 'src/app/classes/field';

class SettingsServiceStub {
  public readonly fieldSize = new BehaviorSubject<number>(30);
  public setFieldSize = (n: number): void => this.fieldSize.next(n);
}

class DifficultyServiceStub {
  public readonly initial = new Difficulty(7, 7);
  public readonly difficulty = new BehaviorSubject(this.initial);
  public newDifficulty = (d: Difficulty): void => this.difficulty.next(d);
}

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async(() => {
    const difficultyServiceStub = new DifficultyServiceStub();
    const settingsServiceStub = new SettingsServiceStub();

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
        { provide: DifficultyService, useValue: difficultyServiceStub },
        { provide: FlagService },
        { provide: ChangeDetectorRef }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BoardComponent);
        component = fixture.componentInstance;
    });
  }));

  describe('Initialization behaviour', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should properly generate new board with initial difficulty', () => {
      const difficultyService = TestBed.inject(DifficultyService);

      component.ngOnInit();
      const generatedBoardDifficulty = component.board.difficulty;
      const expectedBoardDifficulty = difficultyService.initial;

      expect(generatedBoardDifficulty).toBe(expectedBoardDifficulty);
    });
  });

  describe('Clicking behaviour', () => {
    it('should handle click events', () => {
      component.ngOnInit();

      const clicked = component.board.fields[0][0];
      component.onClick(clicked);

      expect(clicked.isChecked).toBe(true);
    });

    it('should handle right click events', () => {
      component.ngOnInit();

      const flagged = component.board.fields[0][0];
      component.onRightClick(flagged);
      expect(flagged.isFlagged).toBe(true);
    });
  });

  describe('Template behaviour', () => {
    const getFirstButton = () => fixture.debugElement.query(By.css('.field'));
    const getBoardContainer = () => fixture.debugElement
      .query(By.css('.board-container'));

    const isSquare = (arr: any[]): boolean =>
      arr.find(row => row.length !== arr.length) !== undefined;

    it('should update field size', () => {
      const settingsService = TestBed.inject(SettingsService);
      settingsService.setFieldSize(42);

      component.ngOnInit();
      expect(component.fieldSize).toBe(42);

      fixture.detectChanges();
      const styles = getBoardContainer().styles;

      expect(styles.minWidth).toBe('42px');
      expect(styles.minHeight).toBe(styles.minWidth);
    });

    it('should properly render board as HTML', () => {
      const difficultyService = TestBed.inject(DifficultyService);
      const expectedDimension = difficultyService.initial.boardDimension;
      component.ngOnInit();
      fixture.detectChanges();

      const boardContainer = getBoardContainer();
      const boardFields = boardContainer.children;

      expect(boardFields.length).toBe(expectedDimension);
      expect(isSquare(boardFields)).toBe(true);
    });

    it('should show hints on checked buttons', () => {
      component.ngOnInit();
      fixture.detectChanges();
      const template = [
        [' ', 'B'],
        ['B', 'B']
      ];
      const bombPlanter = new FakeBombPlanter(template);
      const board = new Board(bombPlanter);
      component.useBoard(board);

      const clicked = component.board.fields[0][0];
      component.onClick(clicked);
      expect(clicked.value).toBe(3);

      fixture.detectChanges();

      const clickedButton = getFirstButton().nativeElement;
      expect(clickedButton.innerHTML).toContain('3');
    });

    it('should render flags', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const flagged = component.board.fields[0][0];
      component.onRightClick(flagged);
      fixture.detectChanges();

      const flaggedButton = getFirstButton().nativeElement;
      expect(flaggedButton.innerHTML).toContain(PrintFieldPipe.flagIcon);
    });

    it('should render bombs', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const bombed = component.board.fields[0][0];
      bombed.value = Field.bomb;
      component.onClick(bombed);

      fixture.detectChanges();

      const bombButton = getFirstButton().nativeElement;
      expect(bombButton.innerHTML).toContain(PrintFieldPipe.bombIcon);
    });
  });

  describe('Flag counter behaviour', () => {
    it('should set flag counter on new game', () => {
      const flagService = TestBed.inject(FlagService);
      const difficultyService = TestBed.inject(DifficultyService);

      difficultyService.newDifficulty(new Difficulty(5, 5));
      component.ngOnInit();

      flagService.counter.subscribe(counter => expect(counter).toBe(5))
        .unsubscribe();
    });

    it('should update flag counter', () => {
      component.ngOnInit();
      const flagService = TestBed.inject(FlagService);
      const difficultyService = TestBed.inject(DifficultyService);
      difficultyService.newDifficulty(new Difficulty(4, 4));

      const flagged = component.board.fields[0][0];
      component.onRightClick(flagged);

      flagService.counter.subscribe(counter => expect(counter).toBe(3))
        .unsubscribe();
    });
  });

  describe('Snack bar behaviour', () => {
    it('should spawn game won snack bar', () => {
      const difficultyService = TestBed.inject(DifficultyService);
      const fakeMatSnackBar = TestBed.inject(MatSnackBar);
      spyOn(fakeMatSnackBar, 'open').and.callThrough();

      difficultyService.newDifficulty(new Difficulty(1, 0));
      fixture.detectChanges();

      const clicked = component.board.fields[0][0];
      component.onClick(clicked);
      fixture.detectChanges();

      expect(fakeMatSnackBar.open)
        .toHaveBeenCalledWith('You won!', jasmine.anything(), jasmine.anything());
    });

    it('should spawn game lost snack bar', () => {
      const fakeMatSnackBar = TestBed.inject(MatSnackBar);
      spyOn(fakeMatSnackBar, 'open').and.callThrough();

      const template = [
        [' ', ' ', ' '],
        [' ', 'B', ' '],
        [' ', ' ', ' ']
      ];
      const bombPlanter = new FakeBombPlanter(template);
      const board = new Board(bombPlanter);
      component.useBoard(board);

      const clicked = component.board.fields[1][1];
      component.onClick(clicked);
      fixture.detectChanges();

      expect(fakeMatSnackBar.open)
        .toHaveBeenCalledWith('Game over', jasmine.anything(), jasmine.anything());
    });

    it('should not spawn snack bar when game continues', () => {
      const fakeMatSnackBar = TestBed.inject(MatSnackBar);
      spyOn(fakeMatSnackBar, 'open').and.callThrough();
      fixture.detectChanges();

      const clicked = component.board.fields[0][0];
      component.onClick(clicked);

      fixture.detectChanges();

      expect(fakeMatSnackBar.open).not.toHaveBeenCalled();
    });

    it('should dismiss snack bars on new difficulty', () => {
      const difficultyService = TestBed.inject(DifficultyService);
      const fakeMatSnackBar = TestBed.inject(MatSnackBar);
      spyOn(fakeMatSnackBar, 'dismiss').and.callThrough();
      fixture.detectChanges();

      // Start new game, dismiss snackbars
      difficultyService.newDifficulty(new Difficulty(7, 7));

      fixture.detectChanges();

      expect(fakeMatSnackBar.dismiss).toHaveBeenCalled();
    });
  });
});
