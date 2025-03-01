import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { SugokuService } from '../services/sugoku.service';
import { DigitOnlyDirective } from '../digit-only.directive';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, DigitOnlyDirective],
})
export class HomePage implements OnInit {
  sugoku = inject(SugokuService);
  items: Signal<{ key: string; row: number; col: number; num: string }[]> =
    computed(() => {
      const result = [];
      const board = this.sugoku.board();
      const rowsCount = board.length;
      const colsCount = board[0].length;

      for (let row = 0; row < rowsCount; row += 1) {
        for (let col = 0; col < colsCount; col += 1) {
          result.push({
            row,
            col,
            key: `${row}${col}`,
            num: String(board[row][col] || ''),
          });
        }
      }

      return result;
    });

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.sugoku.getBoard('random');
    }, 3000);
  }

  updateBoard(event: Event, row: number, col: number) {
    const input = event.target as HTMLInputElement;
    const char = input.value[0] || '0';
    const num = parseInt(char, 10);
    const currentNum = this.sugoku.board()[row][col];

    if (currentNum === num) {
      return;
    }

    this.sugoku.setCell(row, col, num);

    console.log(this.sugoku.board());
  }
}
