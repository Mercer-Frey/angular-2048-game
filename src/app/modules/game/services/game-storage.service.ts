import { Item } from '../models/item';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameStorageService {
  colorMap: { [k: number]: string } = {
    2: ' #fadbd8',
    4: ' #e8daef',
    8: ' #d6eaf8',
    16: '#d0ece7',
    32: '#f9e79f',
    64: '#cd6155',
    128: '#af7ac5',
    256: '#2980b9',
    512: '#1abc9c',
    1024: '#f1c40f',
    2048: '#6e2c00',
    4096: '#34495e',
  };

  items: Item[] = [];
  keyEventCodeMap: { [type: string]: string } = {
    ArrowRight: 'ArrowRight',
    ArrowLeft: 'ArrowLeft',
    ArrowDown: 'ArrowDown',
    ArrowUp: 'ArrowUp',
  };
  constructor() {}
}
