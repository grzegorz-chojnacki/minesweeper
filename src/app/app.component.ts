import { Component, ViewChild, OnInit,
         ChangeDetectionStrategy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { FlagService } from './services/flag.service';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // Fixes ExpressionChangedAfterItHasBeenCheckedError
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  public flagCounter: string;
  public sidenavAutoHide: boolean;

  constructor(private flagService: FlagService,
              private settingsService: SettingsService) { }

  private buildFlagCounter(count: number): string {
    return (count !== undefined) ? `// Flags: ${count}` : '';
  }

  public ngOnInit(): void {
    this.flagService.counter.subscribe(count => {
      this.flagCounter = this.buildFlagCounter(count);
    });

    this.settingsService.sidenavAutoHide.subscribe(option => {
      this.sidenavAutoHide = option;
    });
  }

  public sidenavClose(): void {
    if (this.sidenavAutoHide) {
      this.sidenav.close();
    }
  }
}
