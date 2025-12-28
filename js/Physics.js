import { CONSTANTS } from './constants.js';

export class Physics {
  checkCollisions(ball, player1, player2) {
    // 檢查球與玩家的碰撞
    this.checkBallPlayerCollision(ball, player1);
    this.checkBallPlayerCollision(ball, player2);
  }

  checkBallPlayerCollision(ball, player) {
    const dx = ball.x - player.x;
    const dy = ball.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = ball.radius + player.radius;

    if (distance < minDistance) {
      // 發生碰撞
      this.resolveBallPlayerCollision(ball, player, dx, dy, distance, minDistance);
    }
  }

  resolveBallPlayerCollision(ball, player, dx, dy, distance, minDistance) {
    // 計算碰撞法線
    const nx = dx / distance;
    const ny = dy / distance;

    // 1. 分離重疊物體
    const overlap = minDistance - distance;
    ball.x += nx * overlap;
    ball.y += ny * overlap;

    // 2. 計算相對速度
    const relativeVelocityX = ball.velocityX - player.velocityX;
    const relativeVelocityY = ball.velocityY - player.velocityY;

    // 3. 計算沿法線方向的速度分量
    const velocityAlongNormal = relativeVelocityX * nx + relativeVelocityY * ny;

    // 如果物體正在分離，不需要處理碰撞
    if (velocityAlongNormal > 0) {
      return;
    }

    // 4. 計算反彈（彈性碰撞）
    const restitution = 0.8;
    const impulse = -(1 + restitution) * velocityAlongNormal;

    // 5. 應用衝量到球
    ball.velocityX += impulse * nx;
    ball.velocityY += impulse * ny;

    // 6. 加入玩家的速度（讓玩家可以控制球的方向）
    ball.velocityX += player.velocityX * 0.5;
    ball.velocityY += player.velocityY * 0.3;

    // 7. 限制最大速度
    const maxSpeed = 20;
    const ballSpeed = Math.sqrt(ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY);
    if (ballSpeed > maxSpeed) {
      ball.velocityX = (ball.velocityX / ballSpeed) * maxSpeed;
      ball.velocityY = (ball.velocityY / ballSpeed) * maxSpeed;
    }
  }

}
