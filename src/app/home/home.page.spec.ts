import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomePage } from './home.page';
import { provideHttpClient } from '@angular/common/http';
import { LOADING_BOARD_MESSAGE } from '../services/sugoku.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

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
    if (!easyButton) {
      throw Error('The load-easy-board button was not found in page.');
    }

    easyButton.click();

    expect(component.sugoku.getBoard).toHaveBeenCalledWith('easy');

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const loadingEl = pageElement.querySelector('ion-loading');
      if (!loadingEl) {
        throw Error('Loading element was not found.');
      }

      expect(loadingEl.textContent).toContain(LOADING_BOARD_MESSAGE);
      expect(loadingEl.getAttribute('ng-reflect-is-open')).toBe('true');
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

  it('should verify board', () => {
    // TODO:
  });

  it('should validate board', () => {
    // TODO:
  });
});
