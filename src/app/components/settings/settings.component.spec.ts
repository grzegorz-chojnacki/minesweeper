import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { FormBuilder } from '@angular/forms';
import { FieldSizeService } from './../../services/field-size.service';
import { DifficultyService } from 'src/app/services/difficulty.service';
import { BombPercentagePipe } from 'src/app/pipes/bomb-percentage.pipe';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

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
        { provide: FieldSizeService },
        { provide: DifficultyService }
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
