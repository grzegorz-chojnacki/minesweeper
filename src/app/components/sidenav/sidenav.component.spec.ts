import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';

import { SidenavComponent } from './sidenav.component';

@Component({ selector: 'app-board-form' })
export class MockBoardFormComponent { }

@Component({ selector: 'app-settings' })
export class MockSettingsComponent { }

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDividerModule
      ],
      declarations: [
        SidenavComponent,
        MockBoardFormComponent,
        MockSettingsComponent
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SidenavComponent);
        component = fixture.componentInstance;
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
