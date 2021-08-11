import { TestBed } from '@angular/core/testing';

import { KeycloakInterceptorService } from './keycloak.interceptor.service';

describe('Keycloak.InterceptorService', () => {
  let service: KeycloakInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeycloakInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
