import { TestBed } from '@angular/core/testing';

import {
  ErrorHandlerService,
  HTTP_ERROR_404_MESSAGE,
  HTTP_ERROR_500_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from './error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let httpHandlerSpy: any;
  let clientHandlerSpy: any;
  let loggerSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlerService);
    httpHandlerSpy = spyOn(service, 'handleHttpError').and.callThrough();
    clientHandlerSpy = spyOn(service, 'handleClientError').and.callThrough();
    loggerSpy = spyOn(service.logger, 'log');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle HTTP Error code 404', () => {
    const error = new HttpErrorResponse({ status: 404 });
    service.handle(error);
    expect(httpHandlerSpy).toHaveBeenCalledWith(error);
    expect(service.errorMessage()).toBe(HTTP_ERROR_404_MESSAGE);
  });

  it('should handle HTTP Error code 500', () => {
    const error = new HttpErrorResponse({ status: 500 });
    service.handle(error);
    expect(httpHandlerSpy).toHaveBeenCalledWith(error);
    expect(service.errorMessage()).toBe(HTTP_ERROR_500_MESSAGE);
  });

  it('should handle network error', () => {
    const error = new HttpErrorResponse({ status: 0 });
    service.handle(error);
    expect(httpHandlerSpy).toHaveBeenCalledWith(error);
    expect(service.errorMessage()).toBe(NETWORK_ERROR_MESSAGE);
  });

  it('should handle client error', () => {
    const TEST_MESSAGE = 'Test Message';
    const error = new Error(TEST_MESSAGE);
    service.handle(error);
    expect(clientHandlerSpy).toHaveBeenCalledWith(error);
    expect(service.errorMessage()).toBe(TEST_MESSAGE);
  });

  it('should log error', () => {
    const TEST_MESSAGE = 'Test Message';
    const error = new Error(TEST_MESSAGE);
    service.handle(error);
    expect(loggerSpy).toHaveBeenCalledWith(error);
  });

  it('should clear message', () => {
    service.errorMessage.set('Test Message');
    expect(service.errorMessage()).toBe('Test Message');
    service.clearMessage();
    expect(service.errorMessage()).toBe('');
  });
});
