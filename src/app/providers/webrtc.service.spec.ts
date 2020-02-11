import { TestBed } from '@angular/core/testing';

import { WebrtcService } from './webrtc.service';

describe('WebrtcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebrtcService = TestBed.get(WebrtcService);
    expect(service).toBeTruthy();
  });
});
