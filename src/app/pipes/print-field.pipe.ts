import { Pipe, PipeTransform } from '@angular/core';
import { Field } from 'src/app/classes/field';

@Pipe({
  name: 'printField'
})
export class PrintFieldPipe implements PipeTransform {
  public static readonly bombIcon = PrintFieldPipe.buildIcon('gps_fixed');
  public static readonly flagIcon = PrintFieldPipe.buildIcon('tour');

  private static buildIcon(iconName: string): string {
    return `<span class="material-icons field-icon">${iconName}</span>`;
  }

  public transform(value: number, isFlagged: boolean, isChecked: boolean): string {
    return (isChecked)
      ? this.asChecked(value)
      : this.asNotChecked(isFlagged);
  }
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

  private colored(value: number): string {
    return `<span class="color-${value}">${value}</span>`;
  }

  private asNotChecked(isFlagged: boolean): string {
    return (isFlagged)
      ? PrintFieldPipe.flagIcon
      : '';
  }
}
