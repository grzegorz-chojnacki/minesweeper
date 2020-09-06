import { Field } from './field';

describe('Field', () => {
  it('should apply function around itself in 2d field matrix', () => {
    const fields = [
      [new Field(0, 0), new Field(1, 0), new Field(2, 0)],
      [new Field(0, 1), new Field(1, 1), new Field(2, 1)],
      [new Field(0, 2), new Field(1, 2), new Field(2, 2)]
    ];
    const middleField = fields[1][1];

    middleField.applyAround(fields, field => field.value = 1);
    expect(middleField.value).not.toBe(1);

    const outerRim = fields
      .reduce((acc, row) => acc.concat(row), [])
      .filter(field => field.value === 1);
    expect(outerRim.length).toBe(8);
  });
});
