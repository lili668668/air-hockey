import { CONSTANTS } from './constants.js';

export class Ball {
  constructor() {
    this.radius = CONSTANTS.BALL_RADIUS;
    this.reset();
  }

  update() {
    // 應用摩擦力
    this.velocityX *= CONSTANTS.FRICTION;
    this.velocityY *= CONSTANTS.FRICTION;

    // 更新位置
    this.x += this.velocityX;
    this.y += this.velocityY;

    // 限制最大速度
    const speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
    if (speed > CONSTANTS.BALL_MAX_SPEED) {
      this.velocityX = (this.velocityX / speed) * CONSTANTS.BALL_MAX_SPEED;
      this.velocityY = (this.velocityY / speed) * CONSTANTS.BALL_MAX_SPEED;
    }

    // 檢查球門（讓球可以進入球門區域）
    const goalY = (CONSTANTS.CANVAS_HEIGHT - CONSTANTS.GOAL_WIDTH) / 2;
    const margin = CONSTANTS.TABLE_MARGIN;

    // 左側球門
    if (this.x < margin) {
      if (this.y >= goalY && this.y <= goalY + CONSTANTS.GOAL_WIDTH) {
        // 球在球門範圍內，允許進入
        if (this.x < margin - CONSTANTS.GOAL_DEPTH) {
          // 球完全進入球門，停止（等待得分判定）
          this.velocityX = 0;
          this.velocityY = 0;
        }
      } else {
        // 球撞到左邊界
        this.x = this.radius + margin;
        this.velocityX *= -CONSTANTS.BALL_RESTITUTION;
      }
    }

    // 右側球門
    if (this.x > CONSTANTS.CANVAS_WIDTH - margin) {
      if (this.y >= goalY && this.y <= goalY + CONSTANTS.GOAL_WIDTH) {
        // 球在球門範圍內，允許進入
        if (this.x > CONSTANTS.CANVAS_WIDTH - margin + CONSTANTS.GOAL_DEPTH) {
          // 球完全進入球門，停止（等待得分判定）
          this.velocityX = 0;
          this.velocityY = 0;
        }
      } else {
        // 球撞到右邊界
        this.x = CONSTANTS.CANVAS_WIDTH - margin - this.radius;
        this.velocityX *= -CONSTANTS.BALL_RESTITUTION;
      }
    }

    // 上下邊界
    if (this.y - this.radius < margin) {
      this.y = margin + this.radius;
      this.velocityY *= -CONSTANTS.BALL_RESTITUTION;
    }
    if (this.y + this.radius > CONSTANTS.CANVAS_HEIGHT - margin) {
      this.y = CONSTANTS.CANVAS_HEIGHT - margin - this.radius;
      this.velocityY *= -CONSTANTS.BALL_RESTITUTION;
    }

    // 如果速度很小，停止移動
    if (Math.abs(this.velocityX) < 0.1 && Math.abs(this.velocityY) < 0.1) {
      this.velocityX = 0;
      this.velocityY = 0;
    }
  }

  reset() {
    // 重置到中央
    this.x = CONSTANTS.CANVAS_WIDTH / 2;
    this.y = CONSTANTS.CANVAS_HEIGHT / 2;

    // 隨機初始速度（朝隨機方向）
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 2;
    this.velocityX = Math.cos(angle) * speed;
    this.velocityY = Math.sin(angle) * speed;
  }

  isInGoal() {
    const goalY = (CONSTANTS.CANVAS_HEIGHT - CONSTANTS.GOAL_WIDTH) / 2;
    const margin = CONSTANTS.TABLE_MARGIN;

    // 檢查左側球門
    if (this.x < margin - CONSTANTS.GOAL_DEPTH / 2) {
      if (this.y >= goalY && this.y <= goalY + CONSTANTS.GOAL_WIDTH) {
        return 'left';
      }
    }

    // 檢查右側球門
    if (this.x > CONSTANTS.CANVAS_WIDTH - margin + CONSTANTS.GOAL_DEPTH / 2) {
      if (this.y >= goalY && this.y <= goalY + CONSTANTS.GOAL_WIDTH) {
        return 'right';
      }
    }

    return null;
  }
}
