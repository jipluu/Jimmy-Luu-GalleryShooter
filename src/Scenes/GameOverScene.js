class GameOverScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameOverScene' });
    }
  
    init(data) {
      this.finalScore = data.score || 0;
    }
  
    preload() {
      this.load.image('bg', 'assets/starfield.gif');
    }
  
    create() {
      // Background
      this.add.tileSprite(0, 0, 800, 600, 'bg').setOrigin(0, 0);
  
      // Title text
      this.add.text(400, 150, 'GAME OVER', {
        fontSize: '48px',
        fill: '#ff0000'
      }).setOrigin(0.5);
  
      // Score display
      this.add.text(400, 230, `Final Score: ${this.finalScore}`, {
        fontSize: '32px',
        fill: '#ffffff'
      }).setOrigin(0.5);
  
      // Restart button
      const restartBtn = this.add.text(400, 320, 'Restart Game', {
        fontSize: '28px',
        fill: '#00ff00'
      }).setOrigin(0.5).setInteractive();
  
      restartBtn.on('pointerdown', () => {
        this.scene.start('GalleryShooter');
      });
  
      // Main Menu button
      const menuBtn = this.add.text(400, 380, 'Main Menu', {
        fontSize: '28px',
        fill: '#00ffff'
      }).setOrigin(0.5).setInteractive();
  
      menuBtn.on('pointerdown', () => {
        this.scene.start('MainMenu');
      });
    }
  }
  