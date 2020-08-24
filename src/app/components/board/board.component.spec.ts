import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardComponent } from './board.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';
import { SettingsService } from 'src/app/services/settings.service';
import { DifficultyService } from 'src/app/services/difficulty.service';
import { ChangeDetectorRef } from '@angular/core';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoardComponent],
      providers: [
        { provide: MatSnackBar, useValue: MatSnackBarHarness },
        { provide: SettingsService },
        { provide: DifficultyService },
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
});
