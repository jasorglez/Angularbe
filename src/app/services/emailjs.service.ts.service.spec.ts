/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmailjsService } from './emailjs.service.ts.service';

describe('Service: Emailjs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Emailjs]
    });
  });

  it('should ...', inject([Emailjs], (service: Emailjs) => {
    expect(service).toBeTruthy();
  }));
});
