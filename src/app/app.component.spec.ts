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
import { of } from 'rxjs';

@Component({ selector: 'app-board' })
export class MockBoardComponent { }

@Component({ selector: 'app-settings' })
export class MockSettingsComponent { }

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockBoardComponent,
        MockSettingsComponent
      ],
      imports: [
        BrowserAnimationsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'minesweeper'`, () => {
    expect(component.title).toEqual('minesweeper');
  });

  it('should display correct number of flags if set', () => {
    const newFlagCount = 7;
    const flagService = TestBed.inject(FlagService);
    flagService.setFlags(newFlagCount);

    component.ngOnInit();
    fixture.detectChanges();
    const el = fixture.debugElement
      .query(By.css('.flag-counter')).nativeElement;

    expect(el.textContent).toContain(newFlagCount.toString());
  });

  it('should not display number of flags if undefined', () => {
    const flagService = TestBed.inject(FlagService);
    flagService.setFlags(undefined);

    component.ngOnInit();
    fixture.detectChanges();
    const el = fixture.debugElement
      .query(By.css('.flag-counter')).nativeElement;

    expect(el.textContent).toBe('');
  });

  it('should open sidenav on start', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.sidenav.opened).toBe(true);
  });

  it(`should auto hide sidenav if content is clicked and sidenavAutoHide
      is set to true`, () => {
    const settingsService = TestBed.inject(SettingsService);
    settingsService.setSidenavAutoHide(true);

    component.ngOnInit();
    fixture.detectChanges();
    const content = fixture.debugElement
      .query(By.css('mat-sidenav-content')).nativeElement;
    content.click();

    expect(component.sidenav.opened).toBe(false);
  });

  it(`should not auto hide sidenav if content is clicked and sidenavAutoHide
      is set to false`, () => {
    const settingsService = TestBed.inject(SettingsService);
    settingsService.setSidenavAutoHide(false);

    component.ngOnInit();
    fixture.detectChanges();
    const content = fixture.debugElement
      .query(By.css('mat-sidenav-content')).nativeElement;
    content.click();

    expect(component.sidenav.opened).toBe(true);
  });

  it(`should auto hide sidenav on formSubmitEvent and if sidenavAutoHide
      is set to true`, () => {
    const settingsService = TestBed.inject(SettingsService);
    settingsService.setSidenavAutoHide(true);

    component.ngOnInit();
    fixture.detectChanges();
    const settings = fixture.debugElement
      .query(By.css('app-settings')).nativeElement;
    settings.dispatchEvent(new Event('formSubmitEvent'));

    expect(component.sidenav.opened).toBe(false);
  });

  it(`should not auto hide sidenav on formSubmitEvent and if sidenavAutoHide
      is set to false`, () => {
    const settingsService = TestBed.inject(SettingsService);
    settingsService.setSidenavAutoHide(false);

    component.ngOnInit();
    fixture.detectChanges();
    const settings = fixture.debugElement
      .query(By.css('app-settings')).nativeElement;
    settings.dispatchEvent(new Event('formSubmitEvent'));

    expect(component.sidenav.opened).toBe(true);
  });
});
