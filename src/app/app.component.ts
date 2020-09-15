import { Component, ViewChild, OnInit,
         ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

import { FlagService } from './services/flag.service';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // Fixes ExpressionChangedAfterItHasBeenCheckedError
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  public flagCounter: string;
  public sidenavAutoHide: boolean;

  private readonly subscriptions = new Array<Subscription>();

  constructor(private flagService: FlagService,
              private settingsService: SettingsService) { }

  public ngOnInit(): void {
    const flagServiceSubscription = this.flagService.counter
      .subscribe(count => this.flagCounter = this.buildFlagCounter(count));

    const settingsServiceSubscription = this.settingsService.sidenavAutoHide
      .subscribe(option => this.sidenavAutoHide = option);

    this.subscriptions
      .push(flagServiceSubscription, settingsServiceSubscription);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private buildFlagCounter(count: number): string {
    return (count !== undefined) ? `// Flags: ${count}` : '';
  }

  public sidenavClose(): void {
    if (this.sidenavAutoHide) {
      this.sidenav.close();
    }
  }
}
