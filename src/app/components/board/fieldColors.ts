import { Field } from '../../field';

export const fieldColors = (field: Field) => {
  switch (field.getValue()) {
    case 1: return 'blue';
    case 2: return 'cyan';
    case 3: return 'green';
    case 4: return 'yellow';
    case 5: return 'orange';
    case 6: return 'red';
    case 7: return 'pink';
    case 8: return 'purple';
    default: return '';
  }
};
