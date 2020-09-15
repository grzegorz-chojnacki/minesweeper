import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatSliderModule } from '@angular/material/slider';
import { MatSliderHarness } from '@angular/material/slider/testing';

import { SettingsComponent } from './settings.component';
import { SettingsService } from 'src/app/services/settings.service';
import { FakeStorage } from 'src/app/services/fakeStorage';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let loader: HarnessLoader;

  beforeEach(async(() => {
    const settingsService = new SettingsService(new FakeStorage());

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatCheckboxModule,
        MatSliderModule
      ],
      declarations: [ SettingsComponent ],
      providers: [
        { provide: SettingsService, useValue: settingsService }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SettingsComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
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

    it('should init sidenav auto hide setting', () => {
      const settingsService = TestBed.inject(SettingsService);
      settingsService.setSidenavAutoHide(false);

      component.ngOnInit();

      expect(component.sidenavAutoHide).toBe(false);
    });
  });

  describe('Template behaviour', () => {
    it('should init field size slider value', async () => {
      const settingsService = TestBed.inject(SettingsService);
      const fieldSize = 32;
      settingsService.setFieldSize(fieldSize);

      component.ngOnInit();
      fixture.detectChanges();

      const slider = await loader.getHarness(MatSliderHarness);
      expect(await slider.getValue()).toBe(fieldSize);
    });

    it('should set slider value bounds', async () => {
      const settingsService = TestBed.inject(SettingsService);
      component.ngOnInit();
      fixture.detectChanges();

      const slider = await loader.getHarness(MatSliderHarness);
      expect(await slider.getMaxValue()).toBe(settingsService.maxFieldSize);
      expect(await slider.getMinValue()).toBe(settingsService.minFieldSize);
    });

    it('should set sidenav auto hide checkbox', async () => {
      const settingsService = TestBed.inject(SettingsService);
      settingsService.setSidenavAutoHide(true);

      component.ngOnInit();
      fixture.detectChanges();

      const checkbox = await loader.getHarness(MatCheckboxHarness);
      expect(await checkbox.isChecked()).toBe(true);
    });

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
