import { TestBed } from '@angular/core/testing';
import { mapBoardToGrid, SugokuService } from './sugoku.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  HTTP_ERROR_500_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from './error-handler.service';
import {
  Board,
  BoardResponse,
  SolveResponse,
  ValidateResponse,
} from '../types';

const SOLVED_BOARD: Board = [
  [7, 6, 8, 2, 3, 9, 1, 4, 5],
  [1, 2, 3, 4, 5, 8, 6, 7, 9],
  [4, 5, 9, 6, 7, 1, 8, 2, 3],
  [2, 1, 4, 3, 6, 7, 5, 9, 8],
  [3, 7, 5, 8, 9, 2, 4, 1, 6],
  [8, 9, 6, 1, 4, 5, 2, 3, 7],
  [5, 3, 1, 7, 2, 6, 9, 8, 4],
  [6, 4, 2, 9, 8, 3, 7, 5, 1],
  [9, 8, 7, 5, 1, 4, 3, 6, 2],
];

const UNSOLVED_BOARD: Board = [
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

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
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

    const response: BoardResponse = {
      board: UNSOLVED_BOARD,
    };
    req.flush(response);

    expect(req.request.method).toEqual('GET');
    expect(req.request.url).toBe(url.toString());

    expect(service.grid()).toEqual(mapBoardToGrid(response.board));
    expect(service.boardStatus()).toEqual('unsolved');
    expect(service.errorHandler.errorMessage()).toBe('');
  });

  fit('should validate board', () => {
    const board = SOLVED_BOARD;
    const grid = mapBoardToGrid(board);
    service.grid.set(grid);
    service.validateBoard();
    const url = new URL('/validate', service.SUGOKU_URL);

    const req = httpTesting.expectOne({
      method: 'POST',
      url: url.toString(),
    });

    const response: ValidateResponse = {
      status: 'solved',
    };
    req.flush(response);

    expect(req.request.method).toEqual('POST');
    expect(req.request.url).toBe(url.toString());
    expect(req.request.body).toEqual({ board });

    expect(service.boardStatus()).toEqual(response.status);
    expect(service.grid()).toEqual(grid);
    expect(service.errorHandler.errorMessage()).toBe('');
  });

  it('should solve board', () => {
    const board = UNSOLVED_BOARD;
    const grid = mapBoardToGrid(board);
    service.grid.set(grid);
    service.solveBoard();
    const url = new URL('/solve', service.SUGOKU_URL);

    const req = httpTesting.expectOne({
      method: 'POST',
      url: url.toString(),
    });

    const response: SolveResponse = {
      solution: SOLVED_BOARD,
      status: 'solved',
      difficulty: 'easy',
    };

    req.flush(response);

    expect(req.request.method).toEqual('POST');
    expect(req.request.url).toBe(url.toString());
    expect(req.request.body).toEqual({ board });

    expect(service.boardStatus()).toEqual(response.status);
    expect(service.difficulty()).toEqual(response.difficulty);
    expect(service.grid()).toEqual(grid);
    expect(service.errorHandler.errorMessage()).toBe('');
  });

  it('should handle http errors', () => {
    const difficulty = 'easy';
    service.getBoard(difficulty);
    const url = new URL('/board', service.SUGOKU_URL);
    url.searchParams.set('difficulty', difficulty);

    const req = httpTesting.expectOne({
      method: 'GET',
      url: url.toString(),
    });

    req.flush('Failed', { status: 500, statusText: 'Internal Server Error' });

    expect(service.errorHandler.errorMessage()).toEqual(HTTP_ERROR_500_MESSAGE);
  });

  it('should handle network errors', () => {
    const difficulty = 'easy';
    service.getBoard(difficulty);
    const url = new URL('/board', service.SUGOKU_URL);
    url.searchParams.set('difficulty', difficulty);

    const req = httpTesting.expectOne({
      method: 'GET',
      url: url.toString(),
    });

    req.error(new ProgressEvent('network error!'));

    expect(service.errorHandler.errorMessage()).toEqual(NETWORK_ERROR_MESSAGE);
  });

  xit('should map board to grid', () => {
    // TODO:
  });

  xit('should map grid to board', () => {
    // TODO:
  });
});
