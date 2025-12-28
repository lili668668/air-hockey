import { CONSTANTS } from './constants.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // 載入球魚圖片
    this.ballfishImage = new Image();
    this.ballfishImage.src = 'ballfish.png';
    this.imageLoaded = false;
    this.ballfishImage.onload = () => {
      this.imageLoaded = true;
    };
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render(game) {
    this.clear();

    // 繪製背景
    this.drawBackground();

    // 繪製桌面
    this.drawTable();

    // 繪製球門
    this.drawGoals();

    // 繪製玩家（推桿）
    this.drawPlayer(game.player1, CONSTANTS.COLORS.player1);
    this.drawPlayer(game.player2, CONSTANTS.COLORS.player2);

    // 繪製球
    this.drawBall(game.ball);

    // 繪製分數
    this.drawScore(game.scoreLeft, game.scoreRight);

    // 繪製遊戲狀態 UI
    if (game.gameState === 'gameOver') {
      this.drawGameOver(game.winner);
    }
  }

  drawBackground() {
    // 深色背景
    this.ctx.fillStyle = CONSTANTS.COLORS.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawTable() {
    const margin = CONSTANTS.TABLE_MARGIN;

    // 桌子主體（藍色冰球桌）
    this.ctx.fillStyle = CONSTANTS.COLORS.table;
    this.ctx.fillRect(
      margin,
      margin,
      this.canvas.width - margin * 2,
      this.canvas.height - margin * 2
    );

    // 桌子邊框
    this.ctx.strokeStyle = CONSTANTS.COLORS.tableBorder;
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(
      margin,
      margin,
      this.canvas.width - margin * 2,
      this.canvas.height - margin * 2
    );

    // 中線
    this.ctx.strokeStyle = CONSTANTS.COLORS.centerLine;
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([10, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, margin);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height - margin);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // 中圈
    this.ctx.strokeStyle = CONSTANTS.COLORS.centerCircle;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 65, 0, Math.PI * 2);
    this.ctx.stroke();

    // 中心點
    this.ctx.fillStyle = CONSTANTS.COLORS.centerCircle;
    this.ctx.beginPath();
    this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 6, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawGoals() {
    const margin = CONSTANTS.TABLE_MARGIN;
    const goalY = (this.canvas.height - CONSTANTS.GOAL_WIDTH) / 2;
    const goalDepth = CONSTANTS.GOAL_DEPTH;

    // 左側球門
    this.ctx.fillStyle = CONSTANTS.COLORS.goal;
    this.ctx.fillRect(
      margin - goalDepth,
      goalY,
      goalDepth,
      CONSTANTS.GOAL_WIDTH
    );

    // 左側球門線（紅色）
    this.ctx.strokeStyle = CONSTANTS.COLORS.goalLine;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(margin, goalY);
    this.ctx.lineTo(margin, goalY + CONSTANTS.GOAL_WIDTH);
    this.ctx.stroke();

    // 右側球門
    this.ctx.fillStyle = CONSTANTS.COLORS.goal;
    this.ctx.fillRect(
      this.canvas.width - margin,
      goalY,
      goalDepth,
      CONSTANTS.GOAL_WIDTH
    );

    // 右側球門線（紅色）
    this.ctx.strokeStyle = CONSTANTS.COLORS.goalLine;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width - margin, goalY);
    this.ctx.lineTo(this.canvas.width - margin, goalY + CONSTANTS.GOAL_WIDTH);
    this.ctx.stroke();
  }

  drawPlayer(player, color) {
    // 推桿主體（圓形）
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // 推桿外框
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // 推桿中心點（把手）
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(player.x, player.y, player.radius / 3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawBall(ball) {
    if (this.imageLoaded) {
      // 使用球魚圖片
      const size = ball.radius * 2;
      this.ctx.save();
      this.ctx.drawImage(
        this.ballfishImage,
        ball.x - ball.radius,
        ball.y - ball.radius,
        size,
        size
      );
      this.ctx.restore();
    } else {
      // 圖片未載入時，顯示預設的黑色冰球
      const gradient = this.ctx.createRadialGradient(
        ball.x - ball.radius / 3,
        ball.y - ball.radius / 3,
        0,
        ball.x,
        ball.y,
        ball.radius
      );
      gradient.addColorStop(0, '#4a4a4a');
      gradient.addColorStop(0.7, CONSTANTS.COLORS.puck);
      gradient.addColorStop(1, '#1a1a1a');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // 外框
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
    }
  }

  drawScore(scoreLeft, scoreRight) {
    this.ctx.font = 'bold 60px Arial';
    this.ctx.fillStyle = CONSTANTS.COLORS.scoreText;
    this.ctx.textAlign = 'center';

    // 左側分數
    this.ctx.fillText(scoreLeft, this.canvas.width / 4, 75);

    // 右側分數
    this.ctx.fillText(scoreRight, (this.canvas.width * 3) / 4, 75);
  }

  drawGameOver(winner) {
    // 半透明遮罩
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 勝利文字
    this.ctx.font = 'bold 80px Arial';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'center';

    const text = winner === 'player' ? '你贏了！' : 'AI 獲勝！';
    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 - 25);

    // 提示重新開始
    this.ctx.font = '30px Arial';
    this.ctx.fillText(
      '按空白鍵重新開始',
      this.canvas.width / 2,
      this.canvas.height / 2 + 50
    );
  }
}
