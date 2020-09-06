import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { SettingsComponent } from './settings.component';
import { SettingsService } from 'src/app/services/settings.service';
import { DifficultyService } from 'src/app/services/difficulty.service';
import { BombPercentagePipe } from 'src/app/pipes/bomb-percentage.pipe';
import { Difficulty } from 'src/app/classes/difficulty';
import { BehaviorSubject } from 'rxjs';

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
  public initialDifficulty = new Difficulty(7, 7);
  public difficulty = new BehaviorSubject<Difficulty>(this.initialDifficulty);
  public newDifficulty = (d: Difficulty): void => this.difficulty.next(d);
}
const difficultyServiceStub = new DifficultyServiceStub();

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
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
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
