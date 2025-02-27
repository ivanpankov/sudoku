import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ErrorHandler } from '@angular/core';

const HTTP_ERROR_404_MESSAGE = 'The resource is not found.';
const HTTP_ERROR_500_MESSAGE = 'Something went wrong.';
const CLIENT_ERROR_MESSAGE = 'An error occurred.';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  errorMessage = signal('');
  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    }
  }

  handleHttpError(resp: HttpErrorResponse) {
    switch (resp.status) {
      case 404:
        this.errorMessage.set(HTTP_ERROR_404_MESSAGE);
        break;

      case 500:
        this.errorMessage.set(HTTP_ERROR_500_MESSAGE);
        break;

      default:
        break;
    }
  }

  handleClientError(error: any) {
    console.error(error.stack);
    this.errorMessage.set(CLIENT_ERROR_MESSAGE);
  }

  clearMessage() {
    this.errorMessage.set('');
  }
}
