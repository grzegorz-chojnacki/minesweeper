import { Pipe, PipeTransform } from '@angular/core';
import { Field } from '../field';

@Pipe({
  name: 'printField',
  pure: false
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
  private asChecked(field: Field): string {
    switch (field.getValue()) {
      case Field.bomb:
        return PrintFieldPipe.bombIcon;
      case Field.clear:
        return '';
      default:
        return this.colored(field.getValue());
    }
  }

  // Used when the field hasn't been checked and you can only view if it's flagged
  private asNotChecked(field: Field): string {
    return (field.isFlagged())
      ? PrintFieldPipe.flagIcon
      : '';
  }

  transform(field: Field): string {
    return (field.isChecked())
      ? this.asChecked(field)
      : this.asNotChecked(field);
  }

}
