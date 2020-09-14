import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';

import { SettingsComponent } from './settings.component';
import { SettingsService } from 'src/app/services/settings.service';
import { FakeStorage } from 'src/app/services/fakeStorage';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    const settingsServiceStub = new SettingsService(new FakeStorage());

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatCheckboxModule,
        MatSliderModule
      ],
      declarations: [ SettingsComponent ],
      providers: [
        { provide: SettingsService, useValue: settingsServiceStub }
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

    it('should init sidenav auto hide setting', () => {
      const settingsService = TestBed.inject(SettingsService);
      settingsService.setSidenavAutoHide(false);

      component.ngOnInit();

      expect(component.sidenavAutoHide).toBe(false);
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

  describe('Settings interaction behaviour', () => {
    it('should update field size on slider change event', () => {
      const settingsService = TestBed.inject(SettingsService);

      component.ngOnInit();
      component.onFieldSizeChange({ source: null, value: 44 });

      settingsService.fieldSize
        .subscribe(fieldSize => expect(fieldSize).toBe(44))
        .unsubscribe();
    });

    it('should update sidenav auto hide setting', () => {
      const settingsService = TestBed.inject(SettingsService);
      spyOn(settingsService, 'setSidenavAutoHide');

      component.ngOnInit();
      component.onCheckboxChange();

      expect(settingsService.setSidenavAutoHide).toHaveBeenCalled();
    });
  });
});
