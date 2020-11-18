import { Item } from "../models/item";
import { GameStorageService } from "./game-storage.service";
import { Injectable } from "@angular/core";

type CellPosition = { row: number; col: number };

@Injectable({
  providedIn: "root"
})
export class GameLogicService {
  private size = 4;
  private availableCells: CellPosition[] = [];

  scores = 0;
  theEnd = false;

  constructor(private gameStorageService: GameStorageService) {
    this.generateAvailableCells();
    this.generateItems();
  }

  private get emptyCells(): CellPosition[] {
    return this.availableCells.filter(cell => {
      return !this.gameStorageService.items.some(
        item => item.col === cell.col && item.row === cell.row
      );
    });
  }

  onArrowRight(): void {
    this.move("row", "col", true);
  }
  onArrowLeft(): void {
    this.move();
  }
  onArrowDown(): void {
    this.move("col", "row", true);
  }
  onArrowUp(): void {
    this.move("col", "row", false);
  }

  resetGame() {
    this.scores = 0;
    this.gameStorageService.items = [];
    this.theEnd = false;
    this.generateItems();
  }

  private move(
    dimX: "col" | "row" = "row",
    dimY: "col" | "row" = "col",
    reverse: boolean = false
  ): void {
    if (this.theEnd || !this.canImove(dimX, false, reverse)) {
      return;
    }
    this.clearDeletedItems();

    const mergedItems: Item[] = [];

    for (let x = 1; x <= this.size; x++) {
      const items = this.gameStorageService.items
        .filter(item => item[dimX] === x)
        .sort((a, b) => a[dimY] - b[dimY]);
      if (reverse) {
        items.reverse();
      }
      let y = reverse ? this.size : 1;
      let merged = false;
      let previousItem: Item = null;

      for (const item of items) {
        if (previousItem) {
          if (merged) {
            merged = false;
          } else if (item.value === previousItem.value) {
            reverse ? y++ : y--;
            previousItem.isOnDelete = true;
            item.isOnDelete = true;
            mergedItems.push({
              value: item.value * 2,
              [dimX]: x,
              [dimY]: y
            } as any);
            merged = true;
          }
        }
        item[dimY] = y;
        reverse ? y-- : y++;
        previousItem = item;
      }
    }

    this.scores += mergedItems.reduce((acc, item) => acc + item.value, 0);
    this.gameStorageService.items = [
      ...this.gameStorageService.items,
      ...mergedItems
    ];

    this.generateItems();
    this.theEnd = this.isTheEnd();
  }

  private clearDeletedItems(): void {
    this.gameStorageService.items = this.gameStorageService.items.filter(
      item => !item.isOnDelete
    );
  }

  private generateItems(quantity: number = 2): void {
    const positions: CellPosition[] = this.emptyCells
      .sort(() => 0.5 - Math.random())
      .slice(0, quantity);

    this.gameStorageService.items = [
      ...this.gameStorageService.items,
      ...positions.map<Item>(position => ({
        value: 2,
        col: position.col,
        row: position.row
      }))
    ];
  }

  private isTheEnd(): boolean {
    return !this.canImove("row") && !this.canImove("col");
  }

  private canImove(
    dimX: "row" | "col",
    skipDir = true,
    forward = false
  ): boolean {
    const dimY = dimX === "row" ? "col" : "row";
    for (let x = 1; x <= this.size; x++) {
      const items = this.gameStorageService.items
        .filter(item => !item.isOnDelete && item[dimX] === x)
        .sort((a, b) => a[dimY] - b[dimY]);

      if (items.length !== this.size) {
        if (skipDir) {
          return true;
        }

        const length = items.length;
        const lockedPositions: number[] = [];

        const start = forward ? this.size + 1 - length : 1;
        const end = forward ? this.size : length;
        for (let i = start; i <= end; i++) {
          lockedPositions.push(i);
        }

        if (items.find(item => !lockedPositions.includes(item[dimY]))) {
          return true;
        }
      }
      let prevValue = 0;

      for (const item of items) {
        if (item.value === prevValue) {
          return true;
        }
        prevValue = item.value;
      }
    }
    return false;
  }

  private generateAvailableCells(): void {
    for (let i = 0; i < this.size; i++) {
      for (let k = 0; k < this.size; k++) {
        this.availableCells.push({ row: i + 1, col: k + 1 });
      }
    }
  }
}
