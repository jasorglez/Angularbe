/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GooglesheetsService } from './googlesheets.service';

describe('Service: Googlesheets', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GooglesheetsService]
    });
  });

  it('should ...', inject([GooglesheetsService], (service: GooglesheetsService) => {
    expect(service).toBeTruthy();
  }));
});
