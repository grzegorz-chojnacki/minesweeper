import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { Field } from '../field';

@Pipe({
  name: 'printField',
  pure: false
})
export class PrintFieldPipe implements PipeTransform {
  private static readonly bombIcon = 'gps_fixed';
  private static readonly flagIcon = 'tour</span>';

  private buildIcon(iconName: string, fontSize: number): string {
    return `<span class="material-icons"
              style="font-size: ${fontSize}px;">
              ${iconName}
            </span>`;
  }

  constructor(private domSanitizer: DomSanitizer) { }

  // Used when the field has been checked and you can view its contents
  private asChecked(field: Field, fontSize: number): string | SafeHtml {
    switch (field.getValue()) {
      case Field.bomb:
        return this.domSanitizer.bypassSecurityTrustHtml(
          this.buildIcon(PrintFieldPipe.bombIcon, fontSize));
      case Field.clear:
        return '';
      default:
        return field.getValue().toString();
    }
  }

  // Used when the field hasn't been checked and you can only view if it's flagged
  private asNotChecked(field: Field, fontSize: number): string | SafeHtml {
    return (field.isFlagged())
      ? this.domSanitizer.bypassSecurityTrustHtml(
          this.buildIcon(PrintFieldPipe.flagIcon, fontSize))
      : '';
  }

  transform(field: Field, fontSize: number): string | SafeHtml {
    return (field.isChecked())
      ? this.asChecked(field, fontSize)
      : this.asNotChecked(field, fontSize);
  }

}
