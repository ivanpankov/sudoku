import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Board,
  BoardResponse,
  BoardStatus,
  Difficulty,
  SolveResponse,
  SolveStatus,
  ValidateResponse,
  ValidateStatus,
} from '../types';
import { SUGOKU_URL } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

function clearBoard() {
  const row = new Array(9).fill(null);
  return new Array(9).fill([...row]);
}

@Injectable({
  providedIn: 'root',
})
export class SugokuService {
  readonly SUGOKU_URL = SUGOKU_URL;
  private readonly http = inject(HttpClient);
  private readonly errorHandler = inject(ErrorHandlerService);
  error = signal('');
  board = signal(clearBoard());
  boardStatus: WritableSignal<BoardStatus> = signal('unsolved');
  difficulty: WritableSignal<Difficulty | ''> = signal('');

  constructor() {}

  getBoard(difficulty: Difficulty | 'random' = 'random') {
    const url = new URL('/board', this.SUGOKU_URL);
    url.searchParams.set('difficulty', difficulty);

    this.errorHandler.clearMessage();
    const that = this;

    return this.http.get<BoardResponse>(url.toString()).subscribe({
      next(response) {
        that.board.set(response.board);
      },
      error(error) {
        that.errorHandler.handleError(error);
      },
    });
  }

  validateBoard(board: Board) {
    const url = new URL('/validate', this.SUGOKU_URL);
    const payload = { board };

    this.errorHandler.clearMessage();
    const that = this;

    return this.http.post<ValidateResponse>(url.toString(), payload).subscribe({
      next(response) {
        that.boardStatus.set(response.status);
      },
      error(error) {
        that.errorHandler.handleError(error);
      },
    });
  }

  solveBoard(board: Board) {
    const url = new URL('/solve', this.SUGOKU_URL);
    const payload = { board };

    this.errorHandler.clearMessage();
    const that = this;

    return this.http.post<SolveResponse>(url.toString(), payload).subscribe({
      next(response) {
        that.boardStatus.set(response.status);
        that.difficulty.set(response.difficulty);
        that.board.set(response.solution);
      },
      error(error) {
        that.errorHandler.handleError(error);
      },
    });
  }
}
