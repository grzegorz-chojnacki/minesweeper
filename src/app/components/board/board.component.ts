import { Component, OnInit, Input } from '@angular/core';
import { Difficulty } from 'src/app/difficulty';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() difficulty: Difficulty;

  constructor() { }

  ngOnInit(): void {
  }

}
