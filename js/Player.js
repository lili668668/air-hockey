import { CONSTANTS } from './constants.js';

export class Player {
  constructor(x, y, isAI = false) {
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.radius = CONSTANTS.PLAYER_RADIUS;
    this.isAI = isAI;
  }

  update() {
    // 更新位置
    this.x += this.velocityX;
    this.y += this.velocityY;

    // 邊界限制
    const centerX = CONSTANTS.CANVAS_WIDTH / 2;
    const margin = CONSTANTS.TABLE_MARGIN;

    if (this.isAI) {
      // AI 玩家在右半場
      // 不能越過中線
      if (this.x - this.radius < centerX) {
        this.x = centerX + this.radius;
      }
      // 右邊界
      if (this.x + this.radius > CONSTANTS.CANVAS_WIDTH - margin) {
        this.x = CONSTANTS.CANVAS_WIDTH - margin - this.radius;
      }
    } else {
      // 玩家在左半場
      // 不能越過中線
      if (this.x + this.radius > centerX) {
        this.x = centerX - this.radius;
      }
      // 左邊界
      if (this.x - this.radius < margin) {
        this.x = margin + this.radius;
      }
    }

    // 上下邊界
    if (this.y - this.radius < margin) {
      this.y = margin + this.radius;
    }
    if (this.y + this.radius > CONSTANTS.CANVAS_HEIGHT - margin) {
      this.y = CONSTANTS.CANVAS_HEIGHT - margin - this.radius;
    }
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.velocityX = 0;
    this.velocityY = 0;
  }
}
