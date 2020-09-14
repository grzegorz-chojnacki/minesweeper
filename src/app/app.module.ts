import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

import { AppComponent } from './app.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BoardComponent } from './components/board/board.component';
import { PrintFieldPipe } from './pipes/print-field.pipe';
import { BombPercentagePipe } from './pipes/bomb-percentage.pipe';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { BoardFormComponent } from './components/board-form/board-form.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    BoardComponent,
    PrintFieldPipe,
    BombPercentagePipe,
    SidenavComponent,
    BoardFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatSliderModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
