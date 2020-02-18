import { TestBed } from '@angular/core/testing';

import { MetadataInfoService } from './metadata-info.service';

describe('MetadataInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MetadataInfoService = TestBed.get(MetadataInfoService);
    expect(service).toBeTruthy();
  });
});
