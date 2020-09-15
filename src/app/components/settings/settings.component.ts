import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public fieldSize: number;
  public sidenavAutoHide: boolean;

  constructor(public settingsService: SettingsService) { }

  public onCheckboxChange(): void {
    this.settingsService.setSidenavAutoHide(this.sidenavAutoHide);
  }

  public onFieldSizeChange(event: MatSliderChange): void {
    this.settingsService.setFieldSize(event.value);
  }

  public ngOnInit(): void {
    this.settingsService.fieldSize
      .subscribe(fieldSize => this.fieldSize = fieldSize)
      .unsubscribe();

    this.settingsService.sidenavAutoHide
      .subscribe(sidenavAutoHide => this.sidenavAutoHide = sidenavAutoHide)
      .unsubscribe();
  }
}
