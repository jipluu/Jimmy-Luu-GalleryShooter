class CreditsScene extends Phaser.Scene {
    constructor() {
      super({ key: 'CreditsScene' });
    }
  
    preload() {
      this.load.image('bg', 'assets/starfield.gif');
      this.load.atlasXML('kenny2', 'assets/sheet.png', 'assets/sheet.xml');
      this.load.audio('playerLaserSound', 'assets/sfx_laser1.ogg'); // Optional
    }
  
    create() {
      // Background
      this.starfield = this.add.tileSprite(0, 0, 800, 600, 'bg').setOrigin(0, 0);
  
      // Title
      this.add.text(400, 80, 'Credits', { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);
  
      // Credits text
      const creditText = `
  Game Design and Developed: Jimmy Luu
  Art: Kenny Assets and Galabar
  Sound: Kenney.nl  
  BGM: David Renda
  Made for CMPM 120  
  2025
  
  Thank you for playing!
      `.trim();
  
      this.add.text(400, 200, creditText, {
        fontSize: '20px',
        fill: '#ffffff',
        align: 'center',
        lineSpacing: 10
      }).setOrigin(0.5);
  
      // Button
      const backButton = this.add.text(400, 500, 'Press to go to Main Menu (or press M)', {
        fontSize: '24px',
        fill: '#00ffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
      }).setOrigin(0.5).setInteractive();
  
      backButton.on('pointerover', () => backButton.setStyle({ fill: '#ffff00' }));
      backButton.on('pointerout', () => backButton.setStyle({ fill: '#00ffff' }));
      backButton.on('pointerdown', () => this.scene.start('MainMenu'));
  
      // Keyboard input
      this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
  
      // Add bouncing player ship
      this.player = this.physics.add.sprite(400, 400, 'kenny2', 'playerShip1_red.png');
      this.player.setVelocityX(200);
      this.player.setCollideWorldBounds(true);
      this.player.setBounce(1, 0);
      this.player.setScale(0.7);
  
      // Laser group
      this.playerLasers = this.physics.add.group();
  
      // Sound
      this.playerLaserSound = this.sound.add('playerLaserSound');
  
      // Track time for firing
      this.lastFired = 0;
    }
  
    update(time) {
      this.starfield.tilePositionY -= 0.5;
  
      if (Phaser.Input.Keyboard.JustDown(this.keyM)) {
        this.scene.start('MainMenu');
      }
  
      // Occasionally fire laser
      if (time > this.lastFired + 1000 && Phaser.Math.Between(0, 100) < 5) {
        const laser = this.playerLasers.create(this.player.x, this.player.y - 30, 'kenny2', 'laserBlue01.png');
        laser.setVelocityY(-300);
        this.lastFired = time;
      }
  
      // Destroy lasers that go off screen
      this.playerLasers.children.iterate((laser) => {
        if (laser.y > this.game.config.height) {
          laser.destroy();
        }
      });
    }
  }