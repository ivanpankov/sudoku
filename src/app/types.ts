export type Difficulty = 'easy' | 'medium' | 'hard';
export type ValidateStatus = 'solved' | 'broken' | 'unsolved';
export type SolveStatus = 'solved' | 'broken' | 'unsolvable';
export type Board = Array<Array<number>>;
export type BoardStatus = ValidateStatus | SolveStatus;

export type GridCell = {
  num: number;
  row: number;
  col: number;
  key: string;
  disabled: boolean;
};

export type Grid = GridCell[];

export type BoardResponse = {
  board: Board;
};

export type SudokuRequest = {
  board: Board;
};

export type SolveResponse = {
  difficulty: Difficulty;
  solution: Board;
  status: SolveStatus;
};

export type ValidateResponse = {
  status: ValidateStatus;
};
