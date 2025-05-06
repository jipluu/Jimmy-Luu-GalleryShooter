class GalleryShooter extends Phaser.Scene {
    constructor() {
        super('GalleryShooter');
    }

    preload() {
        this.load.image('background', 'assets/blue.png');  // Update the path

        this.load.atlasXML('kenny', 'assets/spritesheet_spaceships.png', 'assets/spritesheet_spaceships.xml', { premultiplyAlpha: true });
        this.load.atlasXML('kenny2', 'assets/sheet.png', 'assets/sheet.xml');

        // Load sound effects
        this.load.audio('playerLaserSound', 'assets/sfx_laser1.ogg');
        this.load.audio('enemyLaserSound', 'assets/sfx_laser2.ogg');
    }

    create() {
        // Set the texture filter to LINEAR for smoother scaling
        this.textures.get('kenny').setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.textures.get('kenny2').setFilter(Phaser.Textures.FilterMode.LINEAR);

        // Add the background
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        this.initGame();

        // Load sound effects
        this.playerLaserSound = this.sound.add('playerLaserSound');
        this.enemyLaserSound = this.sound.add('enemyLaserSound');

        // Handle keyboard input
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shoot: Phaser.Input.Keyboard.KeyCodes.SPACE,
            restart: Phaser.Input.Keyboard.KeyCodes.R
        });

        // Create score and lives text
        this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '24px', fill: '#fff' });
        this.livesText = this.add.text(20, 50, 'Lives: 3', { fontSize: '24px', fill: '#fff' });

        // Spawn enemies at intervals
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                const type = Phaser.Math.Between(0, 1); // 0 = straight shooter, 1 = diagonal
                const x = Phaser.Math.Between(50, this.game.config.width - 50);
                const enemy = this.enemies.create(x, -50, 'kenny', type === 0 ? 'shipGreen_manned.png' : 'shipBlue_manned.png');
                
                // Set smooth scaling
                enemy.setScale(0.7);  // Scale down to 70% of original size
                enemy.setOrigin(0.5, 0.5);  // Center the origin for smooth scaling

                // Prevent border issues by cropping the sprite
                enemy.setCrop(0, 0, enemy.width, enemy.height); // Crop the texture to the enemy sprite only

                enemy.setData('type', type);
                enemy.setData('lastShotTime', 0);

                if (type === 0) {
                    enemy.setVelocityY(100);
                } else {
                    const dx = Phaser.Math.Between(0, 1) === 0 ? -100 : 100;
                    enemy.setVelocity(dx, 100);
                    enemy.setBounce(1, 0);
                    enemy.body.allowGravity = false;
                    enemy.body.setCollideWorldBounds(true);
                    enemy.body.onWorldBounds = true;

                    enemy.body.world.on('worldbounds', (body) => {
                        if (body.gameObject === enemy && body.blocked.down) {
                            enemy.body.setCollideWorldBounds(false);
                            enemy.setBounce(0, 0);
                        }
                    });

                    enemy.body.checkCollision.up = false;
                    enemy.body.checkCollision.down = false;
                }
            },
            loop: true
        });

        // Overlap detection for collisions
        this.physics.add.overlap(this.spears, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.enemyLasers, this.player, this.hitPlayer, null, this);
        this.physics.add.overlap(this.enemies, this.player, this.hitPlayerByEnemy, null, this);
    }

    initGame() {
        if (this.player) this.player.destroy();
        if (this.spears) this.spears.clear(true, true);
        if (this.enemies) this.enemies.clear(true, true);
        if (this.enemyLasers) this.enemyLasers.clear(true, true);

        this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 50, 'kenny2', 'playerShip1_red.png');
        this.player.setCollideWorldBounds(true);

        this.spears = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.enemyLasers = this.physics.add.group();

        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
    }

    hitEnemy(spear, enemy) {
        spear.destroy();
        enemy.destroy();
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
    }

    hitPlayer(player, laser) {
        laser.destroy();
        this.lives--;
        this.livesText.setText('Lives: ' + this.lives);
        if (this.lives <= 0) this.endGame();
    }

    hitPlayerByEnemy(player, enemy) {
        if (enemy.getData('type') === 1) {
            this.lives--;
            this.livesText.setText('Lives: ' + this.lives);
            enemy.destroy();
            if (this.lives <= 0) this.endGame();
        }
    }

    update(time, delta) {
        if (this.gameOver) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.restart)) {
                this.scene.restart();
            }
            return;
        }

        // Player movement
        if (this.keys.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.keys.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }

        // Player shooting
        if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
            const spear = this.spears.create(this.player.x, this.player.y - 50, 'kenny2', 'laserBlue01.png');
            spear.setVelocityY(-400);
            this.playerLaserSound.play();
        }

        // Remove out-of-bounds spears
        this.spears.children.iterate((spear) => {
            if (spear && spear.y < 0) spear.destroy();
        });

        // Update enemy movement
        this.enemies.children.iterate((enemy) => {
            if (!enemy) return;

            if (enemy.getData('type') === 1) {
                enemy.setVelocityY(100);
                if (enemy.body.blocked.down || enemy.y >= this.game.config.height - enemy.height / 2) {
                    enemy.setCollideWorldBounds(false);
                    enemy.setBounce(0, 0);
                }
            }

            if (enemy.y > this.game.config.height || enemy.x < -50 || enemy.x > this.game.config.width + 50) {
                enemy.destroy();
                this.lives--;
                this.livesText.setText('Lives: ' + this.lives);
                if (this.lives <= 0) this.endGame();
                return;
            }

            if (enemy.getData('type') === 0) {
                const lastShot = enemy.getData('lastShotTime');
                if (time - lastShot > 3500) {
                    const laser = this.enemyLasers.create(enemy.x, enemy.y + 20, 'kenny2', 'laserRed01.png');
                    laser.setVelocityY(200);
                    enemy.setData('lastShotTime', time);
                    this.enemyLaserSound.play();
                }
            }
        });

        // Remove out-of-bounds enemy lasers
        this.enemyLasers.children.iterate((laser) => {
            if (laser && laser.y > this.game.config.height) laser.destroy();
        });
    }

    endGame() {
        this.gameOver = true;
        this.gameOverText = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'Game Over\nPress R to Restart',
            {
                fontSize: '32px',
                fill: '#fff',
                align: 'center'
            }
        ).setOrigin(0.5);
    }
}
