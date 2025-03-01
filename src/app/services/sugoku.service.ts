import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Board,
  BoardResponse,
  BoardStatus,
  Difficulty,
  SolveResponse,
  ValidateResponse,
} from '../types';
import { SUGOKU_URL } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

function clearBoard(): Board {
  const row = new Array(9).fill(0);
  return new Array(9).fill([...row]);
}

@Injectable({
  providedIn: 'root',
})
export class SugokuService {
  readonly SUGOKU_URL = SUGOKU_URL;
  private readonly http = inject(HttpClient);
  readonly errorHandler = inject(ErrorHandlerService);
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
        that.errorHandler.handle(error);
      },
    });
  }

  validateBoard() {
    const url = new URL('/validate', this.SUGOKU_URL);
    const payload = { board: this.board() };

    this.errorHandler.clearMessage();
    const that = this;

    return this.http.post<ValidateResponse>(url.toString(), payload).subscribe({
      next(response) {
        that.boardStatus.set(response.status);
      },
      error(error) {
        that.errorHandler.handle(error);
      },
    });
  }

  solveBoard() {
    const url = new URL('/solve', this.SUGOKU_URL);
    const payload = { board: this.board() };

    this.errorHandler.clearMessage();
    const that = this;

    return this.http.post<SolveResponse>(url.toString(), payload).subscribe({
      next(response) {
        that.boardStatus.set(response.status);
        that.difficulty.set(response.difficulty);
        that.board.set(response.solution);
      },
      error(error) {
        that.errorHandler.handle(error);
      },
    });
  }

  setCell(row: number, col: number, num: number) {
    this.board.update((board) => {
      const targetRow = board[row];
      const targetItem = targetRow[col];

      if (targetItem === num) {
        return board;
      }

      const newRow = [
        ...targetRow.slice(0, col),
        num,
        ...targetRow.slice(col + 1),
      ];
      const newBoard = [
        ...board.slice(0, row),
        newRow,
        ...board.slice(row + 1),
      ];

      return newBoard;
    });
  }
}
