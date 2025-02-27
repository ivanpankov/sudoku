import { TestBed } from '@angular/core/testing';

import { SugokuService } from './sugoku.service';

describe('SugokuService', () => {
  let service: SugokuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SugokuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
