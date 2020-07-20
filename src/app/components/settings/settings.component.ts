import { Component, OnInit } from '@angular/core';
import { difficulties } from '../../difficulties';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  difficulties = difficulties;
  difficultyNames = Object.keys(difficulties);

  // Set initial difficulty
  difficulty: string = this.difficultyNames[0];
  boardDimension: number;
  numberOfBombs: number;

  // Update inputs based on selected preset, but prevent setting them to
  // undefined if the user sets custom values
  updateInputs(): void {
    if (this.difficulty !== 'Custom') {
      this.boardDimension = difficulties[this.difficulty].boardDimension;
      this.numberOfBombs = difficulties[this.difficulty].numberOfBombs;
    }
  }

  // Change the difficulty of the selected preset to 'Custom',
  // or find matching preset
  updateSelect(): void {
    for (const name of this.difficultyNames) {
      if (this.boardDimension === difficulties[name].boardDimension &&
        this.numberOfBombs === difficulties[name].numberOfBombs) {
        this.difficulty = name;
        return;
      }
    }
    this.difficulty = 'Custom';
  }

  constructor() { }

  ngOnInit(): void {
    this.updateInputs();
  }

}
