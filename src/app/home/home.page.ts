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
  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.sugoku.getBoard('random');
    }, 3000);
  }

  updateBoard(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const char = input.value[0] || '0';
    const num = parseInt(char, 10);
    const currentNum = this.sugoku.grid()[index].num;

    if (currentNum === num) {
      return;
    }

    this.sugoku.setCell(index, num);

    console.log(this.sugoku.grid());
  }
}
