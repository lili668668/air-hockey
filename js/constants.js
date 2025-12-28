export const CONSTANTS = {
  // 畫布尺寸
  CANVAS_WIDTH: 1000,
  CANVAS_HEIGHT: 500,

  // 物理參數（桌上冰球：平面滑動）
  GRAVITY: 0,              // 桌上冰球沒有重力
  FRICTION: 0.98,          // 桌面摩擦力，讓球逐漸減速

  // 玩家參數（推桿 paddle/mallet）
  PLAYER_RADIUS: 30,
  PLAYER_SPEED: 7,         // 推桿移動速度

  // 球參數（球魚 ballfish）
  BALL_RADIUS: 18,         // 增大球魚的大小讓它更明顯
  BALL_MAX_SPEED: 12,      // 球的最大速度
  BALL_RESTITUTION: 0.95,  // 碰撞彈性

  // 球門參數
  GOAL_WIDTH: 150,         // 球門寬度
  GOAL_DEPTH: 20,          // 球門深度

  // 場地參數
  TABLE_MARGIN: 25,        // 桌子邊緣到畫布的距離

  // 遊戲規則
  WINNING_SCORE: 7,        // 先得 7 分獲勝
  ROUND_RESET_DELAY: 1500, // 得分後重置延遲（毫秒）

  // AI 參數
  AI_DIFFICULTY: {
    easy: {
      reactionDelay: 50,       // 反應延遲（更快的反應）
      trackAccuracy: 0.85,     // 追蹤準確度（更高精準度）
      moveSpeed: 6.5,          // 移動速度（接近玩家速度）
      predictDistance: 100,    // 預測距離（更好的預測）
      stopThreshold: 15        // 停止移動的閾值（避免抖動）
    },
    medium: {
      reactionDelay: 100,
      trackAccuracy: 0.8,
      moveSpeed: 5.5,
      predictDistance: 100,
      stopThreshold: 15
    },
    hard: {
      reactionDelay: 50,
      trackAccuracy: 0.95,
      moveSpeed: 6,
      predictDistance: 150,
      stopThreshold: 10
    }
  },

  // 顏色配置
  COLORS: {
    background: '#1a1a2e',           // 深色背景
    table: '#2d5f7f',                // 冰球桌藍色
    tableBorder: '#1a3a52',          // 桌子邊框
    centerLine: '#ff3333',           // 紅色中線
    centerCircle: '#ffffff',         // 中圈白色
    goal: '#000000',                 // 球門黑色
    goalLine: '#ff0000',             // 球門線紅色
    player1: '#ffcc00',              // 黃色推桿
    player2: '#ff3333',              // 紅色推桿
    puck: '#2c2c2c',                 // 黑色冰球
    scoreText: '#ffffff'             // 分數文字白色
  }
};
