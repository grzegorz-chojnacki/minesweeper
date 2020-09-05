import { Pipe, PipeTransform } from '@angular/core';
import { Field } from 'src/app/classes/field';

@Pipe({
  name: 'printField'
})
export class PrintFieldPipe implements PipeTransform {
  private static readonly bombIcon = PrintFieldPipe.buildIcon('gps_fixed');
  private static readonly flagIcon = PrintFieldPipe.buildIcon('tour');

  private static buildIcon(iconName: string): string {
    return `<span class="material-icons field-icon">${iconName}</span>`;
  }

  private colored(value: number): string {
    return `<span class="color-${value}">${value}</span>`;
  }

  // Used when the field has been checked and you can view its contents
  private asChecked(value: number): string {
    switch (value) {
      case Field.bomb:
        return PrintFieldPipe.bombIcon;
      case Field.clear:
        return '';
      default:
        return this.colored(value);
    }
  }

  // Used when the field hasn't been checked and you can only view if it's flagged
  private asNotChecked(isFlagged: boolean): string {
    return (isFlagged)
      ? PrintFieldPipe.flagIcon
      : '';
  }

  public transform(value: number, isFlagged: boolean, isChecked: boolean): string {
    return (isChecked)
      ? this.asChecked(value)
      : this.asNotChecked(isFlagged);
  }
}
