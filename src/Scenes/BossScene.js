class BossScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BossScene' });
    this.bossHits = 0;
    this.bossDirection = 1;
  }

  preload() {
    this.load.image('bg', 'assets/starfield.gif');
    this.load.image('boss', 'assets/boss.png');

    this.load.atlasXML('kenny', 'assets/spritesheet_spaceships.png', 'assets/spritesheet_spaceships.xml');
    this.load.atlasXML('kenny2', 'assets/sheet.png', 'assets/sheet.xml');

    this.load.image('bossBullet', 'assets/laserRed02.png');

    this.load.audio('playerLaserSound', 'assets/sfx_laser1.ogg');
    this.load.audio('enemyLaserSound', 'assets/sfx_laser2.ogg');
    this.load.audio('playerHitZap', 'assets/sfx_shieldDown.ogg');
    this.load.audio('explosionSound', 'assets/explosion.ogg');

    this.load.audio('bossHit', 'assets/sfx_twoTone.ogg');
  }

  create() {
    this.starfield = this.add.tileSprite(0, 0, 800, 600, 'bg').setOrigin(0, 0);

    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      shoot: Phaser.Input.Keyboard.KeyCodes.SPACE,
      restart: Phaser.Input.Keyboard.KeyCodes.R
    });

    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.gameWin = false;
    this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '18px', fill: '#fff' });
    this.livesText = this.add.text(20, 50, 'Lives: 3', { fontSize: '18px', fill: '#fff' });
    this.objectiveText = this.add.text(20, 80, 'Defeat the Boss', { fontSize: '18px', fill: '#fff' });


    this.player = this.physics.add.sprite(400, 550, 'kenny2', 'playerShip1_red.png').setCollideWorldBounds(true);
    this.player.setScale(0.7);
    this.player.setDepth(2);

    this.spears = this.physics.add.group(); // player bullets
    this.enemies = this.physics.add.group(); // unused
    this.enemyLasers = this.physics.add.group(); // unused
    this.playerBullets = this.physics.add.group();
    this.bossBullets = this.physics.add.group();

    this.playerLaserSound = this.sound.add('playerLaserSound');
    this.playerHitZap = this.sound.add('playerHitZap');
    this.explosionSound = this.sound.add('explosionSound');
    this.shieldDownSound = this.sound.add('bossHit');

    this.boss = this.physics.add.sprite(400, 100, 'kenny', 'shipPink_manned.png').setCollideWorldBounds(true);
    this.boss.body.setVelocityX(100);
    this.boss.setDisplaySize(100, 100);
    this.boss.setDepth(2);

    // COLLISION DETECTION
    this.physics.add.overlap(this.boss, this.spears, this.onBossHit, null, this);
    this.physics.add.overlap(this.spears, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.enemyLasers, this.player, this.hitPlayer, null, this);
    this.physics.add.overlap(this.enemies, this.player, this.hitPlayerByEnemy, null, this);

    // Add boss bullet collision with player
    this.physics.add.overlap(this.player, this.bossBullets, this.hitPlayer, null, this);

    this.bulletTimer = this.time.addEvent({
      delay: 1000,
      callback: this.fireBossBullets,
      callbackScope: this,
      loop: true
    });

    this.bossPhase = 1;
    this.time.addEvent({
      delay: 5000,
      callback: this.changeBossPhase,
      callbackScope: this,
      loop: true
    });
  }

  hitPlayer(player, laser) {
    laser.destroy();
    this.playerHitZap.play();
    this.lives--;
    this.livesText.setText('Lives: ' + this.lives);
    if (this.lives <= 0) this.endGame();
  }

  hitPlayerByEnemy(player, enemy) {
    if (enemy.getData('type') === 1) {
      this.lives--;
      this.livesText.setText('Lives: ' + this.lives);
      enemy.destroy();
      this.explosionSound.play();
      if (this.lives <= 0) this.endGame();
    }
  }

  update() {
    this.starfield.tilePositionY -= 1;
  
    if (this.keys.left.isDown) {
      this.player.setVelocityX(-300);
    } else if (this.keys.right.isDown) {
      this.player.setVelocityX(300);
    } else {
      this.player.setVelocityX(0);
    }
  
    if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
      const spear = this.spears.create(this.player.x, this.player.y - 50, 'kenny2', 'laserBlue01.png');
      spear.setVelocityY(-400);
      spear.setDepth(1);
      this.playerLaserSound.play();
    }
  
    this.spears.children.iterate(spear => {
      if (spear && spear.y < 0) spear.destroy();
    });
  
    this.bossBullets.children.iterate(bullet => {
      if (bullet && (bullet.y > 600 || bullet.x < 0 || bullet.x > 800)) bullet.destroy();
    });
  
    // Only check for blocked state if the boss exists and has a valid body
    if (this.boss && this.boss.body) {
      if (this.boss.body.blocked.left || this.boss.x <= 50) {
        this.boss.body.setVelocityX(100);
      } else if (this.boss.body.blocked.right || this.boss.x >= 750) {
        this.boss.body.setVelocityX(-100);
      }
    }
  }

  fireBossBullets() {
    if (!this.boss) return;
  
    const x = this.boss.x;
    const y = this.boss.y;
  
    this.sound.play('enemyLaserSound');
    this.spawnBullet(x, y, 0, 200);     // Down
    this.spawnBullet(x, y, -100, 200);  // Diagonal left
    this.spawnBullet(x, y, 100, 200);   // Diagonal right
  }

  spawnBullet(x, y, vx, vy) {
    const bullet = this.bossBullets.create(x, y, 'kenny2', 'laserRed01.png');
    bullet.body.setVelocity(vx, vy);
    bullet.setScale(1);
    bullet.setDepth(1);
    bullet.body.setSize(12, 12);
    console.log("Bullet created at:", x, y);
  }

  onBossHit(boss, bullet) {
    bullet.destroy();
    this.bossHits++;
    console.log('Boss hit!', this.bossHits);

    this.shieldDownSound.play();

    if (this.bossHits >= 20) {
      this.bossDies();
    }
  }

  bossDies() {
    // Clear bullets and destroy boss
    this.bossBullets.clear(true, true);
  
    if (this.boss) {
      this.boss.destroy();
      this.boss = null; // Set to null after destroying the boss
    }
  
    // Play explosion sound effect
    this.sound.play('explosionSound');
  
    this.time.delayedCall(1000, () => {
      console.log('Boss defeated! Switching to WinScene.');
      this.scene.start('WinScene');
    });
  }  

  endGame() {
    this.gameOver = true;
    this.scene.start('GameOverScene');
  }
}

