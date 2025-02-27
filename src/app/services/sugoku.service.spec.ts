import { TestBed } from '@angular/core/testing';
import { SugokuService } from './sugoku.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('SugokuService', () => {
  let service: SugokuService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTesting = TestBed.inject(HttpTestingController);

    service = TestBed.inject(SugokuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get board', () => {
    const difficulty = 'easy';
    service.getBoard(difficulty);
    const url = new URL('/board', service.SUGOKU_URL);
    url.searchParams.set('difficulty', difficulty);

    const req = httpTesting.expectOne({
      method: 'GET',
      url: url.toString(),
    });

    expect(req.request.method).toEqual('GET');
    expect(req.request.url).toBe(url.toString());
  });

  it('should validate board', () => {
    const board = [
      [4, 5, 9, 6, 2, 7, 3, 1, 8],
      [1, 2, 3, 4, 5, 8, 6, 7, 9],
      [6, 7, 8, 1, 9, 3, 4, 5, 2],
      [2, 1, 4, 3, 6, 5, 8, 9, 7],
      [3, 6, 5, 7, 8, 9, 1, 2, 4],
      [8, 9, 7, 2, 1, 4, 5, 3, 6],
      [5, 3, 2, 8, 7, 6, 9, 4, 1],
      [7, 4, 6, 9, 3, 1, 2, 8, 5],
    ];
    service.validateBoard(board);
    const url = new URL('/validate', service.SUGOKU_URL);

    const req = httpTesting.expectOne({
      method: 'POST',
      url: url.toString(),
    });

    expect(req.request.method).toEqual('POST');
    expect(req.request.url).toBe(url.toString());
    expect(req.request.body).toEqual({ board });
  });

  it('should solve board', () => {
    const board = [
      [0, 0, 0, 7, 0, 0, 1, 0, 0],
      [0, 0, 0, 2, 4, 0, 0, 7, 0],
      [0, 0, 0, 0, 0, 0, 2, 0, 5],
      [0, 0, 0, 4, 0, 0, 0, 9, 6],
      [4, 0, 6, 3, 0, 9, 7, 0, 0],
      [8, 9, 0, 0, 1, 0, 0, 0, 4],
      [0, 2, 1, 5, 6, 0, 0, 8, 7],
      [0, 0, 8, 9, 0, 0, 0, 0, 0],
      [0, 7, 0, 8, 0, 0, 0, 6, 0],
    ];
    service.solveBoard(board);
    const url = new URL('/solve', service.SUGOKU_URL);

    const req = httpTesting.expectOne({
      method: 'POST',
      url: url.toString(),
    });

    expect(req.request.method).toEqual('POST');
    expect(req.request.url).toBe(url.toString());
    expect(req.request.body).toEqual({ board });
  });
});
