import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Board,
  BoardResponse,
  BoardStatus,
  Difficulty,
  Grid,
  SolveResponse,
  SudokuRequest,
  ValidateResponse,
} from '../types';
import { SUGOKU_URL } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

const ROWS_COUNT = 9;
const COLS_COUNT = 9;

export function mapBoardToGrid(board: number[][]): Grid {
  const grid: Grid = [];

  for (let row = 0; row < ROWS_COUNT; row += 1) {
    for (let col = 0; col < COLS_COUNT; col += 1) {
      const num = board[row][col];
      grid.push({
        num,
        row,
        col,
        key: `${row}${col}`,
        disabled: num !== 0,
      });
    }
  }

  return grid;
}

export function mapGridToBoard(grid: Grid): Board {
  const board: Board = [];

  for (let row = 0; row < ROWS_COUNT; row += 1) {
    board.push([]);
    for (let col = 0; col < COLS_COUNT; col += 1) {
      board[row][col] = grid[row * COLS_COUNT + col].num;
    }
  }

  return board;
}

export function getClearBoard(): Board {
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
  grid = signal(mapBoardToGrid(getClearBoard()));
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
        const { board } = response;
        const grid: Grid = [];

        for (let row = 0; row < ROWS_COUNT; row += 1) {
          for (let col = 0; col < COLS_COUNT; col += 1) {
            const num = board[row][col];
            grid.push({
              num,
              row,
              col,
              key: `${row}${col}`,
              disabled: num !== 0,
            });
          }
        }

        that.grid.set(grid);
      },
      error(error) {
        that.errorHandler.handle(error);
      },
    });
  }

  validateBoard() {
    const url = new URL('/validate', this.SUGOKU_URL);
    const payload: SudokuRequest = { board: mapGridToBoard(this.grid()) };

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
    const payload: SudokuRequest = { board: mapGridToBoard(this.grid()) };

    this.errorHandler.clearMessage();
    const that = this;

    return this.http.post<SolveResponse>(url.toString(), payload).subscribe({
      next(response) {
        that.boardStatus.set(response.status);
        that.difficulty.set(response.difficulty);

        const board = response.solution;
        const grid: Grid = [];

        for (let row = 0; row < ROWS_COUNT; row += 1) {
          for (let col = 0; col < COLS_COUNT; col += 1) {
            const num = board[row][col];
            grid.push({
              num,
              row,
              col,
              key: `${row}${col}`,
              disabled: true,
            });
          }
        }
        that.grid.set(grid);
      },
      error(error) {
        that.errorHandler.handle(error);
      },
    });
  }

  setCell(index: number, num: number) {
    this.grid.update((grid: Grid) => {
      const targetNum = grid[index].num;

      if (targetNum === num) {
        return grid;
      }

      const newCell = { ...grid[index], num };
      return [...grid.slice(0, index), newCell, ...grid.slice(index + 1)];
    });
  }
}
