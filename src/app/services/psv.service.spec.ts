/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PsvService } from './psv.service';

describe('Service: Psv', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PsvService]
    });
  });

  it('should ...', inject([PsvService], (service: PsvService) => {
    expect(service).toBeTruthy();
  }));
});
