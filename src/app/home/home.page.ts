import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { SugokuService } from '../services/sugoku.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  sugoku = inject(SugokuService);
  constructor() {}

  ngOnInit(): void {
    this.sugoku.getBoard('random').subscribe((data) => {
      console.log(data);
    });
  }
}
