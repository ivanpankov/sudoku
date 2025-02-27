import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board, Difficulty, SolveResponse, ValidateResponse } from '../types';
import { SUGOKU_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SugokuService {
  http = inject(HttpClient);
  SUGOKU_URL = SUGOKU_URL;
  error = signal('');

  constructor() {}

  getBoard(difficulty: Difficulty | 'random' = 'random') {
    this.error.set('');
    const url = new URL('/board', this.SUGOKU_URL);
    url.searchParams.set('difficulty', difficulty);
    return this.http.get<Board>(url.toString());
  }

  validateBoard(board: Board) {
    this.error.set('');
    const url = new URL('/validate', this.SUGOKU_URL);
    const payload = { board };
    return this.http.post<ValidateResponse>(url.toString(), payload);
  }

  solveBoard(board: Board) {
    this.error.set('');
    const url = new URL('/solve', this.SUGOKU_URL);
    const payload = { board };
    return this.http.post<SolveResponse>(url.toString(), payload);
  }
}
