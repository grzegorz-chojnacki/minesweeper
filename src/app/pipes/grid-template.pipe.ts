import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gridTemplate'
})
export class GridTemplatePipe implements PipeTransform {

  transform(boardDimension: number, ...args: number[]): string {
    return `repeat(${boardDimension}, auto)`;
  }

}
