import { TestBed } from '@angular/core/testing';

import { FieldSizeService } from './field-size.service';

describe('FieldSizeService', () => {
  let service: FieldSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
