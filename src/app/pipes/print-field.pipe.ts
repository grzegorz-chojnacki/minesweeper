import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { Field } from '../field';

@Pipe({
  name: 'printField',
  pure: false
})
export class PrintFieldPipe implements PipeTransform {
  private static readonly bombIcon = PrintFieldPipe.buildIcon('gps_fixed');
  private static readonly flagIcon = PrintFieldPipe.buildIcon('tour');

  private static buildIcon(iconName: string): string {
    return `<span class="material-icons"
              style="font-size: unset;">
              ${iconName}
            </span>`;
  }

  constructor(private domSanitizer: DomSanitizer) { }

  // Used when the field has been checked and you can view its contents
  private asChecked(field: Field): string | SafeHtml {
    switch (field.getValue()) {
      case Field.bomb:
        return this.domSanitizer.bypassSecurityTrustHtml(PrintFieldPipe.bombIcon);
      case Field.clear:
        return '';
      default:
        return field.getValue().toString();
    }
  }

  // Used when the field hasn't been checked and you can only view if it's flagged
  private asNotChecked(field: Field): string | SafeHtml {
    return (field.isFlagged())
      ? this.domSanitizer.bypassSecurityTrustHtml(PrintFieldPipe.flagIcon)
      : '';
  }

  transform(field: Field): string | SafeHtml {
    return (field.isChecked())
      ? this.asChecked(field)
      : this.asNotChecked(field);
  }

}
