import { Game } from './Game.js';
import { CONSTANTS } from './constants.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const restartBtn = document.getElementById('btn-restart');

  // 設置畫布尺寸（全螢幕響應式）
  function resizeCanvas() {
    // 計算可用空間（扣除控制按鈕等元素的高度）
    const availableHeight = window.innerHeight - 200; // 預留空間給控制按鈕
    const availableWidth = window.innerWidth;

    // 根據 CONSTANTS 的寬高比例計算最佳尺寸
    const aspectRatio = CONSTANTS.CANVAS_WIDTH / CONSTANTS.CANVAS_HEIGHT;

    let canvasWidth, canvasHeight;

    // 根據可用空間選擇限制因素
    if (availableWidth / availableHeight > aspectRatio) {
      // 高度是限制因素
      canvasHeight = availableHeight;
      canvasWidth = canvasHeight * aspectRatio;
    } else {
      // 寬度是限制因素
      canvasWidth = availableWidth * 0.95; // 留 5% 邊距
      canvasHeight = canvasWidth / aspectRatio;
    }

    // 設置畫布實際渲染大小（保持遊戲邏輯尺寸不變）
    canvas.width = CONSTANTS.CANVAS_WIDTH;
    canvas.height = CONSTANTS.CANVAS_HEIGHT;

    // 設置畫布顯示大小
    canvas.style.width = Math.floor(canvasWidth) + 'px';
    canvas.style.height = Math.floor(canvasHeight) + 'px';
  }

  // 初始化畫布尺寸
  resizeCanvas();

  // 監聽視窗大小變化
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  });

  // 創建並啟動遊戲
  const game = new Game(canvas);
  game.start();

  // 監控遊戲狀態來顯示/隱藏重新開始按鈕
  let previousGameState = game.gameState;
  setInterval(() => {
    if (game.gameState !== previousGameState) {
      if (game.gameState === 'gameOver') {
        restartBtn.style.display = 'block';
      } else {
        restartBtn.style.display = 'none';
      }
      previousGameState = game.gameState;
    }
  }, 100);

  console.log('桌上冰球遊戲已啟動！');
  console.log('控制方式：');
  console.log('- 電腦：方向鍵 或 W/A/S/D 移動推桿');
  console.log('- 手機：使用螢幕上的觸控按鈕');
  console.log('- 重新開始：空白鍵或點擊重新開始按鈕（遊戲結束時）');
});
