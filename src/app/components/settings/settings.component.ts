import { Component, OnInit } from '@angular/core';
import { Difficulty, difficulties } from '../../difficulty';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  difficulties = difficulties;
  difficultyNames = difficulties.map(difficulty => difficulty.name);

  // Special difficulty
  customDifficulty = difficulties[0];

  // Set initial difficulty
  difficulty: Difficulty = difficulties[1];
  boardDimension: number;
  numberOfBombs: number;

  // Update inputs based on selected preset, but prevent setting them to
  // undefined if the user chooses the 'Custom' preset
  updateInputs(): void {
    if (this.difficulty !== this.customDifficulty) {
      this.boardDimension = this.difficulty.boardDimension;
      this.numberOfBombs = this.difficulty.numberOfBombs;
    }
  }

  // Try to match current input values to existing preset, or set it to custom
  updateSelect(): void {
    this.difficulty = difficulties.find(difficulty => {
      return this.boardDimension === difficulty.boardDimension &&
             this.numberOfBombs === difficulty.numberOfBombs;
    }) || this.customDifficulty;
  }

  constructor() { }

  ngOnInit(): void {
    this.updateInputs();
  }

}
