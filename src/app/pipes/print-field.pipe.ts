import { Pipe, PipeTransform } from '@angular/core';
import { Field } from '../field';

@Pipe({
  name: 'printField',
  pure: false
})
export class PrintFieldPipe implements PipeTransform {

  // When the field has been checked and you can view its contents
  private asChecked(field: Field): string {
    switch (field.getValue()) {
      case Field.bomb:
        return 'B';
      case Field.clear:
        return ' ';
      default:
        return field.getValue().toString();
    }
  }

  // When the field hasn't been checked and you can only view  if it's flagged
  private asNotChecked(field: Field): string {
    return (field.isFlagged())
      ? 'F'
      : ' ';
  }

  transform(field: Field): string {
    return (field.isChecked())
      ? this.asChecked(field)
      : this.asNotChecked(field);
  }

}
