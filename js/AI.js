import { CONSTANTS } from './constants.js';

export class AI {
  constructor(difficulty = 'easy') {
    this.difficulty = difficulty;
    this.config = CONSTANTS.AI_DIFFICULTY[difficulty];
    this.lastDecisionTime = 0;
    this.targetX = 0;
    this.targetY = 0;
  }

  update(ball, aiPlayer, currentTime) {
    // 定期更新決策（模擬反應時間）
    if (currentTime - this.lastDecisionTime < this.config.reactionDelay) {
      return;
    }
    this.lastDecisionTime = currentTime;

    // 防守自己的球門
    const goalY = (CONSTANTS.CANVAS_HEIGHT - CONSTANTS.GOAL_WIDTH) / 2;
    const goalCenterY = goalY + CONSTANTS.GOAL_WIDTH / 2;

    // 計算追蹤目標
    let targetX = aiPlayer.initialX;
    let targetY = goalCenterY;

    // 如果球在 AI 這邊或朝 AI 移動
    const ballInAISide = ball.x > CONSTANTS.CANVAS_WIDTH / 2;
    const ballMovingToAI = ball.velocityX > 0;

    if (ballInAISide || ballMovingToAI) {
      // 追蹤球的位置
      const predictX = ball.x + ball.velocityX * this.config.predictDistance;
      const predictY = ball.y + ball.velocityY * this.config.predictDistance;

      // 根據準確度調整目標
      const accuracy = this.config.trackAccuracy;
      targetX = ball.x + (predictX - ball.x) * accuracy;
      targetY = ball.y + (predictY - ball.y) * accuracy;

      // 限制在自己的半場
      const centerX = CONSTANTS.CANVAS_WIDTH / 2;
      const margin = CONSTANTS.TABLE_MARGIN;
      targetX = Math.max(centerX + aiPlayer.radius, Math.min(CONSTANTS.CANVAS_WIDTH - margin - aiPlayer.radius, targetX));
      targetY = Math.max(margin + aiPlayer.radius, Math.min(CONSTANTS.CANVAS_HEIGHT - margin - aiPlayer.radius, targetY));
    } else {
      // 球不在這邊，回到守門位置
      targetX = CONSTANTS.CANVAS_WIDTH - 100;
      targetY = goalCenterY;
    }

    this.targetX = targetX;
    this.targetY = targetY;

    // 移動到目標位置
    this.moveToTarget(aiPlayer);
  }

  moveToTarget(aiPlayer) {
    const threshold = this.config.stopThreshold || 15;
    const moveSpeed = this.config.moveSpeed;

    // 計算距離
    const dx = this.targetX - aiPlayer.x;
    const dy = this.targetY - aiPlayer.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 如果已經很接近目標，停止移動（避免抖動）
    if (distance < threshold) {
      aiPlayer.velocityX = 0;
      aiPlayer.velocityY = 0;
      return;
    }

    // 平滑移動到目標位置
    // 使用歸一化的方向向量，保證移動方向正確
    const dirX = dx / distance;
    const dirY = dy / distance;

    aiPlayer.velocityX = dirX * moveSpeed;
    aiPlayer.velocityY = dirY * moveSpeed;
  }
}
