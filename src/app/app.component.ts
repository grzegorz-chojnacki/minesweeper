import { Component, ViewChild, OnInit,
         ChangeDetectionStrategy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { FlagService } from './services/flag.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // Fixes ExpressionChangedAfterItHasBeenCheckedError
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  public title = 'minesweeper';
  public flagCounter: string;

  constructor(private flagService: FlagService) { }

  private buildFlagCounter(count: number): string {
    return (count !== undefined) ? `// Flags: ${count}` : '';
  }

  public ngOnInit(): void {
    this.flagService.counter.subscribe(count => {
      this.flagCounter = this.buildFlagCounter(count);
    });
  }

  public onCloseSidenavEvent(): void {
    this.sidenav.close();
  }
}
