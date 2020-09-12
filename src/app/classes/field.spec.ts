import { Field } from './field';

describe('Field', () => {
  it('should generate field matrix of proper size', () => {
    const fields = Field.makeMatrix(10);
    expect(fields.length).toBe(10);
    fields.every(row => expect(row.length).toBe(fields.length));
  });

  it('should throw error on wrong field matrix size', () => {
    expect(() => Field.makeMatrix(0)).toThrow();
  });

  it('should apply function around itself in field matrix', () => {
    const fields = Field.makeMatrix(5);
    const middleField = fields[2][2];

    middleField.applyAround(fields, field => field.value = 1);
    expect(middleField.value).not.toBe(1);

    const outerRim = fields
      .reduce((flat, nextRow) => flat.concat(nextRow), [])
      .filter(field => field.value === 1);
    expect(outerRim.length).toBe(8);
  });
});
