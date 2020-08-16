import { Pipe, PipeTransform } from '@angular/core';
import { Difficulty } from '../difficulty';

@Pipe({
  name: 'bombPercentage'
})
export class BombPercentagePipe implements PipeTransform {

  public transform(difficulty: Difficulty): string {
    const fraction = difficulty.numberOfBombs / difficulty.boardDimension ** 2;
    return `About ${(fraction * 100).toFixed(0)}% of fields`;
  }

}
