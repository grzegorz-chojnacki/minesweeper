import { Field } from 'src/app/classes/field';
import { Difficulty } from 'src/app/classes/difficulty';

export class BombPlanter {
  constructor(public readonly difficulty: Difficulty) { }

  // Shuffle array in place
  protected shuffle(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
  }

  protected addHints(bombedFields: Field[], fields: Field[][]): void {
    const incrementValue = (field: Field) =>
      (field.value !== Field.bomb) && field.value++;

    bombedFields
      .forEach(field => field.applyAround(fields, incrementValue));
  }

  public plantBombs(firstClicked: Field, fields: Field[][]): void {
    const fieldsFlatList = fields
      .reduce((flat, nextRow) => flat.concat(nextRow), [])
      .filter(field => field !== firstClicked);

    this.shuffle(fieldsFlatList);

    const bombedFields = fieldsFlatList
      .slice(0, this.difficulty.numberOfBombs);

    bombedFields.forEach(field => { field.value = Field.bomb; });
    this.addHints(bombedFields, fields);
  }
}

export class FakeBombPlanter extends BombPlanter {
  private static parseTemplate(template: string[][]): Difficulty {
    const notSquare = (arr: string[][]) => arr
      .find(row => row.length !== arr.length) !== undefined;

    if (template.length === 0) {
      throw new Error('Template is empty');
    } else if (notSquare(template)) {
      throw new Error('Template is not a square');
    }
    const boardDimension = template.length;
    const numberOfBombs = template
      .reduce((flat, nextRow) => flat.concat(nextRow), [])
      .filter(field => field.includes('B')).length;
    return new Difficulty(boardDimension, numberOfBombs);
  }

  constructor(private template: string[][]) {
    super(FakeBombPlanter.parseTemplate(template));
    this.template = template;
  }

  public plantBombs(firstClicked: Field, fields: Field[][]): void {
    const bombedFields = [];
    for (let y = 0; y < this.template.length; y++) {
      for (let x = 0; x < this.template.length; x++) {
        if (this.template[y][x].includes('B')) {
          fields[y][x].value = Field.bomb;
          bombedFields.push(fields[y][x]);
        }
      }
    }
    this.addHints(bombedFields, fields);
  }
}
