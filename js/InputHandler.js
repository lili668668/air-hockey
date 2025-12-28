export class InputHandler {
  constructor() {
    this.keys = {};
    this.touchControls = {
      left: false,
      right: false,
      up: false,
      down: false,
      restart: false
    };
    this.setupListeners();
  }

  setupListeners() {
    // 鍵盤控制
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      this.keys[e.key.toLowerCase()] = true;

      // 防止頁面滾動
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
      this.keys[e.key.toLowerCase()] = false;
    });

    // 觸控控制
    this.setupTouchControls();
  }

  setupTouchControls() {
    const buttons = {
      left: document.getElementById('btn-left'),
      right: document.getElementById('btn-right'),
      up: document.getElementById('btn-up'),
      down: document.getElementById('btn-down'),
      restart: document.getElementById('btn-restart')
    };

    Object.keys(buttons).forEach(key => {
      if (buttons[key]) {
        // 觸控開始
        buttons[key].addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.touchControls[key] = true;
          buttons[key].classList.add('active');
        });

        // 觸控結束
        buttons[key].addEventListener('touchend', (e) => {
          e.preventDefault();
          this.touchControls[key] = false;
          buttons[key].classList.remove('active');
        });

        // 觸控取消
        buttons[key].addEventListener('touchcancel', (e) => {
          e.preventDefault();
          this.touchControls[key] = false;
          buttons[key].classList.remove('active');
        });

        // 滑鼠支持（用於測試）
        buttons[key].addEventListener('mousedown', (e) => {
          e.preventDefault();
          this.touchControls[key] = true;
          buttons[key].classList.add('active');
        });

        buttons[key].addEventListener('mouseup', (e) => {
          e.preventDefault();
          this.touchControls[key] = false;
          buttons[key].classList.remove('active');
        });

        buttons[key].addEventListener('mouseleave', (e) => {
          this.touchControls[key] = false;
          buttons[key].classList.remove('active');
        });
      }
    });
  }

  isKeyPressed(key) {
    return this.keys[key] || false;
  }

  isLeftPressed() {
    return this.isKeyPressed('ArrowLeft') || this.isKeyPressed('a') || this.touchControls.left;
  }

  isRightPressed() {
    return this.isKeyPressed('ArrowRight') || this.isKeyPressed('d') || this.touchControls.right;
  }

  isUpPressed() {
    return this.isKeyPressed('ArrowUp') || this.isKeyPressed('w') || this.touchControls.up;
  }

  isDownPressed() {
    return this.isKeyPressed('ArrowDown') || this.isKeyPressed('s') || this.touchControls.down;
  }

  isRestartPressed() {
    return this.isKeyPressed(' ') || this.touchControls.restart;
  }
}
