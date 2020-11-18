import { GameLogicService } from './services/game-logic.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './components/game.component';
import { GameStorageService } from './services/game-storage.service';

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule],
  exports: [GameComponent],
  providers: [GameStorageService, GameLogicService],
})
export class GameModule {}
