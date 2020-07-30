import { Pipe, PipeTransform } from '@angular/core';
import { Field } from '../field';

@Pipe({
  name: 'printField'
})
export class PrintFieldPipe implements PipeTransform {
  private readonly bombIcon = this.buildIcon('gps_fixed');
  private readonly flagIcon = this.buildIcon('tour');

  private buildIcon(iconName: string): string {
    return `<span class="material-icons field-icon">${iconName}</span>`;
  }

  private colored(value: number): string {
    return `<span class="color-${value}">${value}</span>`;
  }

  // Used when the field has been checked and you can view its contents
  private asChecked(value: number): string {
    switch (value) {
      case Field.bomb:
        return this.bombIcon;
      case Field.clear:
        return '';
      default:
        return this.colored(value);
    }
  }

  // Used when the field hasn't been checked and you can only view if it's flagged
  private asNotChecked(isFlagged: boolean): string {
    return (isFlagged)
      ? this.flagIcon
      : '';
  }

  transform(value: number, isFlagged: boolean, isChecked: boolean): string {
    return (isChecked)
      ? this.asChecked(value)
      : this.asNotChecked(isFlagged);
  }

}
