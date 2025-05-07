class WinScene extends Phaser.Scene {
    constructor() {
      super({ key: 'WinScene' });
    }
  
    preload() {
      this.load.image('bg', 'assets/starfield.gif');
    }
  
    create() {
      // Background
      this.add.tileSprite(0, 0, 800, 600, 'bg').setOrigin(0, 0);
      
      // UI Text
      this.add.text(400, 200, 'You Win!', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(400, 260, 'Congratulations! You defeated the boss.', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
  
      // Endless Mode Instructions
      this.add.text(400, 300, 'Endless Mode: Rack up as many points as you can before you die', {
        fontSize: '20px', fill: '#fff', align: 'center'
      }).setOrigin(0.5);
  
      // Option buttons
      const mainMenuButton = this.add.text(400, 380, 'Go to Main Menu', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
      const endlessModeButton = this.add.text(400, 420, 'Go to Endless Mode', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
  
      // Button interaction
      mainMenuButton.setInteractive();
      endlessModeButton.setInteractive();
  
      mainMenuButton.on('pointerdown', () => {
        this.scene.start('TitleScreen');
      });
  
      endlessModeButton.on('pointerdown', () => {
        this.scene.start('EndlessScene');
      });
  
    }
  }
  