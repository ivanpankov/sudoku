import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { LogServiceService } from './log-service.service';

export const HTTP_ERROR_404_MESSAGE = 'The resource is not found.';
export const HTTP_ERROR_500_MESSAGE = 'Something went wrong.';
export const NETWORK_ERROR_MESSAGE = 'Network Error';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  logger = inject(LogServiceService);
  errorMessage = signal('');
  handle(error: any): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.handleClientError(error);
    }

    this.logger.log(error);
  }

  handleHttpError(resp: HttpErrorResponse) {
    switch (resp.status) {
      case 404:
        this.errorMessage.set(HTTP_ERROR_404_MESSAGE);
        break;

      case 0:
        this.errorMessage.set(NETWORK_ERROR_MESSAGE);
        break;

      default:
        this.errorMessage.set(HTTP_ERROR_500_MESSAGE);
        break;
    }
  }

  handleClientError(error: any) {
    this.errorMessage.set(error.message);
  }

  clearMessage() {
    this.errorMessage.set('');
  }
}
