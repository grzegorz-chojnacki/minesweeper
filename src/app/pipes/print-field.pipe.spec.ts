import { PrintFieldPipe } from './print-field.pipe';

describe('PrintFieldPipe', () => {
  it('should create an instance', () => {
    const pipe = new PrintFieldPipe();
    expect(pipe).toBeTruthy();
  });

  it('should output nothing if field is clear', () => {
    const pipe = new PrintFieldPipe();
    const fields = [
      { value: 0, flagged: false, checked: false },
      { value: 0, flagged: false, checked: true },
    ];

    fields.forEach(field => {
      const result = pipe.transform(field.value, field.flagged, field.checked);
      expect(result).toBe('');
    });
  });

  it('should output nothing if field is not checked or flagged', () => {
    const pipe = new PrintFieldPipe();
    const field = { value: 7, flagged: false, checked: false };

    const result = pipe.transform(field.value, field.flagged, field.checked);
    expect(result).toBe('');
  });

  it('should output correct markup if field is flagged', () => {
    const pipe = new PrintFieldPipe();
    const field = { value: 0, flagged: true, checked: false };

    const result = pipe.transform(field.value, field.flagged, field.checked);
    expect(result).toBe('<span class="material-icons field-icon">tour</span>');
  });

  it('should output correct markup if field is checked and is a bomb', () => {
    const pipe = new PrintFieldPipe();
    const field = { value: 7, flagged: false, checked: true };

    const result = pipe.transform(field.value, field.flagged, field.checked);
    expect(result).toBe(
      `<span class="color-${field.value}">${field.value}</span>`
    );
  });
});
