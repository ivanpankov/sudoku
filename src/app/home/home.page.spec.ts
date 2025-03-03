import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomePage } from './home.page';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { LOADING_BOARD_MESSAGE } from '../services/sugoku.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HTTP_ERROR_404_MESSAGE } from '../services/error-handler.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load easy board', waitForAsync(() => {
    spyOn(component.sugoku, 'getBoard').and.callThrough();

    const pageElement: HTMLElement = fixture.nativeElement;

    const easyButton: HTMLButtonElement | null =
      pageElement.querySelector('#load-easy-board');
    expect(easyButton).toBeTruthy;

    easyButton?.click();

    expect(component.sugoku.getBoard).toHaveBeenCalledWith('easy');

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const loadingEl = pageElement.querySelector('ion-loading');
      expect(loadingEl).toBeTruthy;
      expect(loadingEl?.getAttribute('ng-reflect-message')).toBe(
        LOADING_BOARD_MESSAGE
      );
      expect(loadingEl?.getAttribute('ng-reflect-is-open')).toBe('true');
    });
  }));

  xit('should load medium board', () => {
    // TODO:
  });

  xit('should load hard board', () => {
    // TODO:
  });

  xit('should load random board', () => {
    // TODO:
  });

  xit('should verify board', () => {
    // TODO:
  });

  xit('should validate board', () => {
    // TODO:
  });

  it('should show client error', async () => {
    const ERROR_MESSAGE = 'Something bad happened.';
    component.sugoku.errorHandler.handle(new Error(ERROR_MESSAGE));
    const pageElement: HTMLElement = fixture.nativeElement;
    spyOn(component.sugoku.errorHandler, 'clearMessage').and.callThrough();

    await fixture.whenStable();
    fixture.detectChanges();

    const alertEl = pageElement.querySelector('ion-alert');
    expect(alertEl).toBeTruthy;
    expect(alertEl?.getAttribute('ng-reflect-is-open')).toBe('true');
    expect(alertEl?.getAttribute('ng-reflect-header')).toBe(
      component.sugoku.errorHandler.ERROR_HEADER
    );
    expect(alertEl?.getAttribute('ng-reflect-message')).toBe(ERROR_MESSAGE);

    const dismissButton = alertEl?.querySelector('button');

    expect(dismissButton).toBeTruthy;

    dismissButton?.click();

    expect(component.sugoku.errorHandler).toHaveBeenCalled;
  });

  it('should show network error', async () => {
    component.sugoku.errorHandler.handle(
      new HttpErrorResponse({ status: 404 })
    );
    const pageElement: HTMLElement = fixture.nativeElement;
    spyOn(component.sugoku.errorHandler, 'clearMessage').and.callThrough();

    await fixture.whenStable();
    fixture.detectChanges();

    const alertEl = pageElement.querySelector('ion-alert');
    expect(alertEl).toBeTruthy;
    expect(alertEl?.getAttribute('ng-reflect-is-open')).toBe('true');
    expect(alertEl?.getAttribute('ng-reflect-header')).toBe(
      component.sugoku.errorHandler.ERROR_HEADER
    );
    expect(alertEl?.getAttribute('ng-reflect-message')).toBe(
      HTTP_ERROR_404_MESSAGE
    );
    expect(alertEl?.getAttribute('ng-reflect-sub-header')).toBe('Status: 404');

    const dismissButton = alertEl?.querySelector('button');

    expect(dismissButton).toBeTruthy;

    dismissButton?.click();

    expect(component.sugoku.errorHandler).toHaveBeenCalled;
  });
});
