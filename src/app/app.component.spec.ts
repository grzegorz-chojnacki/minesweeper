import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { AppComponent } from './app.component';
import { FlagService } from './services/flag.service';
import { SettingsService } from './services/settings.service';

@Component({ selector: 'app-board' })
export class MockBoardComponent { }

@Component({ selector: 'app-sidenav' })
export class MockSidenavComponent { }

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const getElement = (selector: string): HTMLElement => fixture.debugElement
    .query(By.css(selector)).nativeElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockBoardComponent,
        MockSidenavComponent
      ],
      imports: [
        BrowserAnimationsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('Flag counter behaviour', () => {
    it('should display correct number of flags if set', () => {
      const newFlagCount = 7;
      const flagService = TestBed.inject(FlagService);
      flagService.setCounter(newFlagCount);

      component.ngOnInit();
      fixture.detectChanges();

      const flagCounter = getElement('.flag-counter');
      expect(flagCounter.innerHTML).toContain(newFlagCount.toString());
    });

    it('should not display number of flags if undefined', () => {
      const flagService = TestBed.inject(FlagService);
      flagService.setCounter(undefined);

      component.ngOnInit();
      fixture.detectChanges();

      const flagCounter = getElement('.flag-counter');
      expect(flagCounter.innerHTML).toBe('');
    });
  });

  describe('Sidenav behaviour', () => {
    it('should open sidenav on start', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.sidenav.opened).toBe(true);
    });

    it('should hide sidenav if content is clicked and option set to true', () => {
      const settingsService = TestBed.inject(SettingsService);
      settingsService.setSidenavAutoHide(true);
      component.ngOnInit();
      fixture.detectChanges();

      const content = getElement('mat-sidenav-content');
      content.click();

      expect(component.sidenav.opened).toBe(false);
    });

    it('should not hide sidenav if content is clicked and option set to false', () => {
      const settingsService = TestBed.inject(SettingsService);
      settingsService.setSidenavAutoHide(false);
      component.ngOnInit();
      fixture.detectChanges();

      const content = getElement('mat-sidenav-content');
      content.click();

      expect(component.sidenav.opened).toBe(true);
    });

    it('should hide sidenav on formSubmitEvent if option is true', () => {
      const settingsService = TestBed.inject(SettingsService);
      settingsService.setSidenavAutoHide(true);
      component.ngOnInit();
      fixture.detectChanges();

      const settings = getElement('app-sidenav');
      settings.dispatchEvent(new Event('formSubmitEvent'));

      expect(component.sidenav.opened).toBe(false);
    });

    it('should not hide sidenav on formSubmitEvent if option is false', () => {
      const settingsService = TestBed.inject(SettingsService);
      settingsService.setSidenavAutoHide(false);
      component.ngOnInit();
      fixture.detectChanges();

      const settings = getElement('app-sidenav');
      settings.dispatchEvent(new Event('formSubmitEvent'));

      expect(component.sidenav.opened).toBe(true);
    });
  });
});
