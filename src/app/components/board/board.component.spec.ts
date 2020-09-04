import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BoardComponent } from './board.component';
import { SettingsService } from 'src/app/services/settings.service';
import { DifficultyService } from 'src/app/services/difficulty.service';
import { ChangeDetectorRef } from '@angular/core';
import { FlagService } from 'src/app/services/flag.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Difficulty } from 'src/app/difficulty';
import { PrintFieldPipe } from 'src/app/pipes/print-field.pipe';

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
        { provide: SettingsService, useValue: { fieldSize: of(42) }},
        { provide: DifficultyService, useValue: {
          difficulty: of(new Difficulty(7, 7, 'Test'))
        }},
        { provide: FlagService, useValue: { setFlags: () => {} }},
        { provide: ChangeDetectorRef }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update field size', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const styles = fixture.debugElement
      .query(By.css('.board-container'))
      .styles;

    expect(styles.minWidth).toBe('42px');
    expect(styles.minHeight).toBe(styles.minWidth);
  });
  // it('should generate new board on new difficulty', () => {});
  // it('should properly render board as HTML', () => {});
  // it('should handle click events', () => {});
  // it('should handle rigth click events', () => {});
  // it('should handle every game state', () => {});
  // it('should spawn snack bars', () => {});
  // it('should dismiss snack bars', () => {});
});
