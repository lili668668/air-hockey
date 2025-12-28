import { CONSTANTS } from './constants.js';
import { Player } from './Player.js';
import { Ball } from './Ball.js';
import { Physics } from './Physics.js';
import { Renderer } from './Renderer.js';
import { InputHandler } from './InputHandler.js';
import { AI } from './AI.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;

    // 初始化遊戲物件（桌上冰球的初始位置）
    const centerY = CONSTANTS.CANVAS_HEIGHT / 2;
    this.player1 = new Player(120, centerY, false);  // 左側玩家
    this.player2 = new Player(880, centerY, true);   // 右側 AI
    this.ball = new Ball();

    // 初始化系統
    this.physics = new Physics();
    this.renderer = new Renderer(canvas);
    this.input = new InputHandler();
    this.ai = new AI('easy');

    // 遊戲狀態
    this.scoreLeft = 0;
    this.scoreRight = 0;
    this.gameState = 'playing'; // 'playing', 'roundEnd', 'gameOver'
    this.winner = null;

    // 時間管理
    this.lastTime = 0;
    this.isRunning = false;

    // 回合重置計時器
    this.resetTimer = null;
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  gameLoop(timestamp) {
    if (!this.isRunning) return;

    // 計算 delta time（未使用，但保留以備將來優化）
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    // 處理輸入
    if (this.gameState === 'playing') {
      this.processInput();
    }

    // 更新遊戲狀態
    if (this.gameState === 'playing') {
      this.update(timestamp);
    }

    // 渲染畫面
    this.renderer.render(this);

    // 處理重新開始
    if (this.gameState === 'gameOver' && this.input.isRestartPressed()) {
      this.restart();
    }

    // 繼續循環
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  processInput() {
    // 左右移動
    if (this.input.isLeftPressed()) {
      this.player1.velocityX = -CONSTANTS.PLAYER_SPEED;
    } else if (this.input.isRightPressed()) {
      this.player1.velocityX = CONSTANTS.PLAYER_SPEED;
    } else {
      this.player1.velocityX = 0;
    }

    // 上下移動
    if (this.input.isUpPressed()) {
      this.player1.velocityY = -CONSTANTS.PLAYER_SPEED;
    } else if (this.input.isDownPressed()) {
      this.player1.velocityY = CONSTANTS.PLAYER_SPEED;
    } else {
      this.player1.velocityY = 0;
    }
  }

  update(timestamp) {
    // 更新玩家位置
    this.player1.update();
    this.player2.update();

    // 更新球位置
    this.ball.update();

    // AI 決策
    this.ai.update(this.ball, this.player2, timestamp);

    // 物理碰撞檢測
    this.physics.checkCollisions(this.ball, this.player1, this.player2);

    // 檢查得分
    this.checkScore();
  }

  checkScore() {
    // 檢查球是否進入球門
    const goalSide = this.ball.isInGoal();

    if (goalSide === 'left') {
      // 球進入左側球門，右側（AI）得分
      this.scoreRight++;
      this.onScore('right');
    } else if (goalSide === 'right') {
      // 球進入右側球門，左側（玩家）得分
      this.scoreLeft++;
      this.onScore('left');
    }
  }

  onScore(side) {
    console.log(`${side} 得分！分數：${this.scoreLeft} - ${this.scoreRight}`);

    // 檢查是否有人贏了
    if (this.scoreLeft >= CONSTANTS.WINNING_SCORE) {
      this.gameState = 'gameOver';
      this.winner = 'player';
    } else if (this.scoreRight >= CONSTANTS.WINNING_SCORE) {
      this.gameState = 'gameOver';
      this.winner = 'ai';
    } else {
      // 繼續下一回合
      this.gameState = 'roundEnd';
      setTimeout(() => this.resetRound(), CONSTANTS.ROUND_RESET_DELAY);
    }
  }

  resetRound() {
    // 重置球的位置
    this.ball.reset();

    // 重置玩家位置
    this.player1.reset();
    this.player2.reset();

    // 恢復遊戲狀態
    this.gameState = 'playing';
  }

  restart() {
    // 重置分數
    this.scoreLeft = 0;
    this.scoreRight = 0;

    // 重置遊戲狀態
    this.gameState = 'playing';
    this.winner = null;

    // 重置回合
    this.resetRound();
  }
}
