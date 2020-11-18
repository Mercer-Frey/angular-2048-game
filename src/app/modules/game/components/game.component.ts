import { GameLogicService } from './../services/game-logic.service';
import { GameStorageService } from '../services/game-storage.service';
import { Item } from '../models/item';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  constructor(
    public gameStorageService: GameStorageService,
    public gameLogicService: GameLogicService
  ) {}

  ngOnInit(): void {}
  getStyles(item: Item): { [p: string]: string } {
    const top = `${item.row * 110 - 100}px`;
    const left = `${item.col * 110 - 100}px`;
    return {
      top,
      left,
      'background-color':
        this.gameStorageService.colorMap[item.value] || 'black',
    };
  }
  @HostListener('window:keyup', ['$event'])
  onKeyup(event: KeyboardEvent): void {
    if (this.gameStorageService.keyEventCodeMap[event.code]) {
      const keyType = this.gameStorageService.keyEventCodeMap[event.code];
      this.gameLogicService[`on${keyType}`]();
    }
  }
  onResetGame(): void {
    this.gameLogicService.resetGame();
  }
}
